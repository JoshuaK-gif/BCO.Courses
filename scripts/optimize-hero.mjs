import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const src = "public/hero-classroom.jpg";
const out = "public";

async function optimize() {
  const sizes = [
    { width: 640, suffix: "sm" },
    { width: 1024, suffix: "md" },
    { width: 1920, suffix: "lg" },
  ];

  for (const { width, suffix } of sizes) {
    await sharp(src)
      .resize(width, null, { withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(join(out, `hero-classroom-${suffix}.jpg`));

    await sharp(src)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(out, `hero-classroom-${suffix}.webp`));

    await sharp(src)
      .resize(width, null, { withoutEnlargement: true })
      .avif({ quality: 65 })
      .toFile(join(out, `hero-classroom-${suffix}.avif`));

    console.log(`✔ ${suffix} (${width}px)`);
  }

  // Also create a single optimized fallback for CSS bg
  await sharp(src)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(out, "hero-classroom.webp"));

  await sharp(src)
    .resize(1200, null, { withoutEnlargement: true })
    .avif({ quality: 60 })
    .toFile(join(out, "hero-classroom.avif"));

  console.log("✔ fallback (1200px)");
  console.log("Done!");
}

optimize().catch(console.error);
