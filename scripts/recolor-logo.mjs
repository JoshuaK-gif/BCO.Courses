/**
 * Recolors the BCO logo from blue to the green brand palette, and
 * regenerates the 64x64 favicon. Dependency-free (PNG codec + HSV remap).
 *
 * Usage: node scripts/recolor-logo.mjs
 */
import fs from "fs";
import zlib from "zlib";
import path from "path";

const ROOT = path.resolve(process.cwd());
const LOGO = path.join(ROOT, "public/bco-logo.png");
const ORIGINAL = path.join(ROOT, "assets-src/bco-logo-original.png");
const ICON = path.join(ROOT, "src/app/icon.png");
const ICON_BG = [0x7c, 0x2d, 0x12]; // deep brand orange

/**
 * Cool hues — blue [185..255] and green [90..185] — remap onto the
 * orange brand ramp [20..45]. Warm oranges, golds and neutrals pass
 * through untouched.
 */
function coolToOrange([r, g, b]) {
  const [h, s, v] = rgbToHsv(r, g, b);
  if (h >= 90 && h <= 255 && s > 0.12) {
    const nh = 20 + ((h - 90) * 25) / 165;
    return hsvToRgb(nh, s, v);
  }
  return [r, g, b];
}

// ---------- PNG codec ----------
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function parsePNG(bytes) {
  if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error("Not a PNG");
  let off = 8;
  const chunks = [];
  while (off < bytes.length) {
    const len = bytes.readUInt32BE(off);
    const type = bytes.toString("ascii", off + 4, off + 8);
    const data = bytes.subarray(off + 8, off + 8 + len);
    chunks.push({ type, data });
    off += 12 + len;
  }
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const png = {
    width: ihdr.readUInt32BE(0),
    height: ihdr.readUInt32BE(4),
    bitDepth: ihdr[8],
    colorType: ihdr[9],
    interlace: ihdr[12],
    palette: null,
    trns: null,
    idat: Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data)),
  };
  const plte = chunks.find((c) => c.type === "PLTE");
  if (plte) {
    png.palette = [];
    for (let i = 0; i < plte.data.length; i += 3) {
      png.palette.push([plte.data[i], plte.data[i + 1], plte.data[i + 2]]);
    }
  }
  const trns = chunks.find((c) => c.type === "tRNS");
  if (trns) png.trns = Array.from(trns.data);
  return png;
}

function unfilter(raw, width, height, bpp) {
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const rowIn = y * (stride + 1) + 1;
    const rowOut = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[rowOut + x - bpp] : 0;
      const b = y > 0 ? out[rowOut - stride + x] : 0;
      const c = x >= bpp && y > 0 ? out[rowOut - stride + x - bpp] : 0;
      let val = raw[rowIn + x];
      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        val = (val + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
      }
      out[rowOut + x] = val;
    }
  }
  return out;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG({ width, height, colorType, palette, trns, pixels }) {
  const bpp = colorType === 3 ? 1 : colorType === 2 ? 3 : 4;
  const stride = width * bpp;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: None
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = colorType; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const parts = [
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
  ];
  if (palette) {
    const plte = Buffer.alloc(palette.length * 3);
    palette.forEach(([r, g, b], i) => { plte[i * 3] = r; plte[i * 3 + 1] = g; plte[i * 3 + 2] = b; });
    parts.push(chunk("PLTE", plte));
  }
  if (trns) parts.push(chunk("tRNS", Buffer.from(trns)));
  parts.push(chunk("IDAT", zlib.deflateSync(raw, { level: 9 })));
  parts.push(chunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(parts);
}

// ---------- color math ----------
function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  return [h, max === 0 ? 0 : d / max, max / 255];
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// ---------- main ----------
// Always start from the pristine original so the remap is idempotent.
fs.copyFileSync(ORIGINAL, LOGO);
const bytes = fs.readFileSync(LOGO);

const png = parsePNG(bytes);
if (png.colorType !== 3 || png.bitDepth !== 8 || png.interlace !== 0) {
  throw new Error(`Unsupported PNG: colorType=${png.colorType} depth=${png.bitDepth} interlace=${png.interlace}`);
}

console.log("Palette before:", png.palette.map((c) => c.map((v) => v.toString(16).padStart(2, "0")).join("")).join(" "));

png.palette = png.palette.map((c) => coolToOrange(c));
console.log("Palette after: ", png.palette.map((c) => c.map((v) => v.toString(16).padStart(2, "0")).join("")).join(" "));

// Re-encode the recolored logo
const rawIdx = zlib.inflateSync(png.idat);
const indices = unfilter(rawIdx, png.width, png.height, 1);
fs.writeFileSync(LOGO, encodePNG({ width: png.width, height: png.height, colorType: 3, palette: png.palette, trns: png.trns, pixels: indices }));
console.log(`✔ ${LOGO} recolored (${png.width}x${png.height})`);

// ---------- favicon: square center-crop + box downscale + green pad ----------
const size = 64;
const crop = Math.min(png.width, png.height);
const x0 = Math.floor((png.width - crop) / 2);
const y0 = Math.floor((png.height - crop) / 2);

const getPixel = (x, y) => {
  const idx = indices[(y0 + y) * png.width + (x0 + x)];
  const [r, g, b] = png.palette[idx];
  const a = png.trns ? (png.trns[idx] ?? 255) : 255;
  return [r, g, b, a];
};

const iconPx = Buffer.alloc(size * size * 3);
const scale = crop / size;
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    // box average over the source block
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    const sx0 = Math.floor(x * scale), sx1 = Math.min(crop, Math.ceil((x + 1) * scale));
    const sy0 = Math.floor(y * scale), sy1 = Math.min(crop, Math.ceil((y + 1) * scale));
    for (let sy = sy0; sy < sy1; sy++) {
      for (let sx = sx0; sx < sx1; sx++) {
        const [pr, pg, pb, pa] = getPixel(sx, sy);
        r += pr * pa; g += pg * pa; b += pb * pa; a += pa; n++;
      }
    }
    const o = (y * size + x) * 3;
    if (a === 0) {
      iconPx[o] = ICON_BG[0]; iconPx[o + 1] = ICON_BG[1]; iconPx[o + 2] = ICON_BG[2];
    } else {
      iconPx[o] = Math.round(r / a);
      iconPx[o + 1] = Math.round(g / a);
      iconPx[o + 2] = Math.round(b / a);
    }
  }
}
fs.writeFileSync(ICON, encodePNG({ width: size, height: size, colorType: 2, pixels: iconPx }));
console.log(`✔ ${ICON} regenerated (${size}x${size})`);
