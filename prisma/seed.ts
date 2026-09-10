/**
 * BCO Courses seed data.
 *
 * IMPORTANT: These are realistic SAMPLE courses to demonstrate the platform.
 * Before going live, replace prices/urls/affiliate links with verified data
 * from real providers via the admin dashboard (/admin). Ratings are left
 * empty on purpose — never invent ratings.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const categories = [
  {
    name: "Grant Writing",
    slug: "grant-writing",
    icon: "📝",
    sortOrder: 1,
    description:
      "Courses on grant proposal writing, fundraising, donor research and project proposal development — for NGO workers, founders and researchers seeking funding.",
  },
  {
    name: "Scholarships",
    slug: "scholarships",
    icon: "🎒",
    sortOrder: 2,
    description:
      "Courses on scholarship applications, scholarship essays, personal statements and academic application strategies.",
  },
  {
    name: "Career Development",
    slug: "career-development",
    icon: "💼",
    sortOrder: 3,
    description:
      "CV and resume writing, cover letters, job applications, interview preparation and professional communication.",
  },
  {
    name: "Internships",
    slug: "internships",
    icon: "🚀",
    sortOrder: 4,
    description:
      "Internship applications, workplace readiness, professional skills and networking for early-career starters.",
  },
  {
    name: "Fellowships",
    slug: "fellowships",
    icon: "🏅",
    sortOrder: 5,
    description:
      "Fellowship applications, personal statements, leadership development and professional networking.",
  },
  {
    name: "Remote Work",
    slug: "remote-work",
    icon: "🌍",
    sortOrder: 6,
    description:
      "Remote work skills, digital collaboration tools and building an international online career from anywhere.",
  },
  {
    name: "Freelancing",
    slug: "freelancing",
    icon: "🧰",
    sortOrder: 7,
    description:
      "Starting freelancing, finding clients, writing freelance proposals and managing a freelance business.",
  },
  {
    name: "LinkedIn & Networking",
    slug: "linkedin-networking",
    icon: "🤝",
    sortOrder: 8,
    description:
      "LinkedIn profiles, personal branding, professional presence and career networking.",
  },
  {
    name: "Entrepreneurship",
    slug: "entrepreneurship",
    icon: "💡",
    sortOrder: 9,
    description:
      "Business planning, startup development, marketing and small business management for founders.",
  },
  {
    name: "International Opportunities",
    slug: "international-opportunities",
    icon: "✈️",
    sortOrder: 10,
    description:
      "International applications, global careers, cross-cultural skills and pursuing opportunities abroad.",
  },
];

const providers = [
  {
    name: "Sample Academy",
    slug: "sample-academy",
    websiteUrl: "https://example.com",
    description: "Sample provider used for demonstration courses. Replace with real providers.",
    commissionNote: "Placeholder — add real commission terms when onboarding the provider.",
  },
  {
    name: "Sample Institute",
    slug: "sample-institute",
    websiteUrl: "https://example.org",
    description: "Second sample provider for demonstration. Replace with real providers.",
    commissionNote: "Placeholder — add real commission terms when onboarding the provider.",
  },
  {
    name: "Global Learning Hub",
    slug: "global-learning-hub",
    websiteUrl: "https://example.net",
    description: "Third sample provider for demonstration. Replace with real providers.",
    commissionNote: "Placeholder — add real commission terms when onboarding the provider.",
  },
];

type SeedCourse = {
  title: string;
  slug: string;
  categorySlug: string;
  providerSlug: string;
  shortDescription: string;
  description: string;
  level?: string;
  price?: number;
  isFree?: boolean;
  duration?: string;
  certificate?: boolean;
  language?: string;
  format?: string;
  learningOutcomes: string[];
  targetAudience: string[];
  whyRecommended: string;
  featured?: boolean;
  affiliateUrl: string;
};

const courses: SeedCourse[] = [
  // ---------- GRANT WRITING ----------
  {
    title: "Grant Writing for Beginners",
    slug: "grant-writing-for-beginners",
    categorySlug: "grant-writing",
    providerSlug: "sample-academy",
    shortDescription:
      "Learn the fundamentals of grant writing: finding funders, structuring proposals and avoiding the mistakes that get applications rejected.",
    description:
      "This beginner-friendly course introduces the grant writing process from start to finish. You will learn how grantmaking works, how to identify funding opportunities that match your project, and how to build a clear, persuasive proposal.\n\nThe course walks through each section of a typical grant application — needs statement, objectives, activities, budget and evaluation — with practical examples. You will also learn how to respond to funder guidelines and common reasons proposals are declined.",
    level: "Beginner",
    price: 29,
    duration: "6 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Understand how grantmaking and donor funding work",
      "Identify funding opportunities suited to your project",
      "Structure a clear grant proposal",
      "Develop measurable project objectives",
      "Create a simple project budget",
      "Avoid common proposal mistakes",
    ],
    targetAudience: ["NGO workers", "Founders", "Community project leaders", "Beginners"],
    whyRecommended:
      "This course may be useful for people who want to strengthen their grant-writing skills before applying for funding opportunities on BCO.",
    featured: true,
    affiliateUrl: "https://example.com/grant-writing-for-beginners?ref=bco",
  },
  {
    title: "Fundraising Strategy for Nonprofits",
    slug: "fundraising-strategy-for-nonprofits",
    categorySlug: "grant-writing",
    providerSlug: "sample-institute",
    shortDescription:
      "Build a practical fundraising strategy that combines grants, donations and partnerships for your organization.",
    description:
      "Fundraising is bigger than grant writing. This course helps you design a fundraising plan that fits your organization's size and stage, covering donor research, grant funding, individual giving and corporate partnerships.\n\nYou will finish with a simple fundraising calendar and templates you can adapt to your organization.",
    level: "Intermediate",
    price: 49,
    duration: "9 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Build a diversified fundraising strategy",
      "Research and qualify potential donors",
      "Plan a year-round fundraising calendar",
      "Communicate impact to funders",
    ],
    targetAudience: ["Nonprofit staff", "Founders", "Fundraising volunteers"],
    whyRecommended:
      "A natural next step after learning grant writing — helps you plan funding beyond a single proposal.",
    affiliateUrl: "https://example.org/fundraising-strategy?ref=bco",
  },
  {
    title: "Proposal Writing Essentials",
    slug: "proposal-writing-essentials",
    categorySlug: "grant-writing",
    providerSlug: "global-learning-hub",
    shortDescription:
      "Write project proposals that clearly communicate your idea, budget and impact to funders and partners.",
    description:
      "Strong proposals are clear, specific and realistic. This course teaches the essentials of proposal development for projects of any size: defining the problem, designing activities, estimating costs and presenting measurable outcomes.\n\nIncludes worked examples and a reusable proposal outline.",
    level: "Beginner",
    price: 19,
    duration: "4 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Define the problem your proposal addresses",
      "Design activities with clear outputs",
      "Present realistic budgets and timelines",
      "Communicate measurable impact",
    ],
    targetAudience: ["Students", "NGO workers", "Young professionals", "Beginners"],
    whyRecommended:
      "Proposal writing appears in grant applications, fellowships and internships — one skill, many uses.",
    affiliateUrl: "https://example.net/proposal-writing-essentials?ref=bco",
  },

  // ---------- SCHOLARSHIPS ----------
  {
    title: "How to Apply for Scholarships Successfully",
    slug: "how-to-apply-for-scholarships-successfully",
    categorySlug: "scholarships",
    providerSlug: "sample-academy",
    shortDescription:
      "A step-by-step guide to finding scholarships, preparing strong applications and writing essays that stand out.",
    description:
      "Scholarship applications reward preparation. This course shows you how to search for scholarships that match your profile, track deadlines, and prepare the documents most applications require.\n\nYou will learn how to approach scholarship essays and personal statements with a clear structure, and how referees can help your application when briefed properly.",
    level: "All Levels",
    price: 39,
    duration: "7 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Find scholarships matching your profile",
      "Organize applications and deadlines",
      "Structure a compelling scholarship essay",
      "Request effective recommendation letters",
      "Avoid common application mistakes",
    ],
    targetAudience: ["Students", "Graduates", "Anyone seeking funding for study"],
    whyRecommended:
      "Directly supports BCO users preparing scholarship applications — practical and Beginner-friendly.",
    featured: true,
    affiliateUrl: "https://example.com/scholarship-success?ref=bco",
  },
  {
    title: "Personal Statements That Work",
    slug: "personal-statements-that-work",
    categorySlug: "scholarships",
    providerSlug: "sample-institute",
    shortDescription:
      "Learn to write personal statements for scholarships, fellowships and admissions — with structure, evidence and authenticity.",
    description:
      "The personal statement is where applications are won or lost. This course breaks down what selection committees look for and how to present your story honestly and persuasively.\n\nYou will draft, revise and polish a statement through guided exercises, with examples for scholarships, fellowships and graduate admissions.",
    level: "Intermediate",
    price: 25,
    duration: "5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Understand what committees look for",
      "Structure a personal statement effectively",
      "Show impact with concrete examples",
      "Revise and edit your own writing",
    ],
    targetAudience: ["Students", "Fellowship applicants", "Graduate school applicants"],
    whyRecommended:
      "Personal statements are required for scholarships AND fellowships — this course serves both paths.",
    affiliateUrl: "https://example.org/personal-statements?ref=bco",
  },
  {
    title: "Free: Introduction to Scholarship Applications",
    slug: "introduction-to-scholarship-applications",
    categorySlug: "scholarships",
    providerSlug: "global-learning-hub",
    shortDescription:
      "A free short course covering the basics of scholarship applications: documents, deadlines and first steps.",
    description:
      "This free mini-course is a starting point for anyone new to scholarship applications. It explains the common components of an application, how to build a simple tracker for deadlines, and what to prepare before you start writing.",
    level: "Beginner",
    isFree: true,
    price: 0,
    duration: "1.5 hours",
    certificate: false,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Know the common parts of a scholarship application",
      "Create a deadline tracking system",
      "Prepare documents before applying",
    ],
    targetAudience: ["Students", "First-time applicants"],
    whyRecommended:
      "A free, low-pressure introduction for BCO users who are new to scholarship applications.",
    affiliateUrl: "https://example.net/free-scholarship-intro?ref=bco",
  },

  // ---------- CAREER DEVELOPMENT ----------
  {
    title: "How to Build a Professional CV",
    slug: "professional-cv-writing",
    categorySlug: "career-development",
    providerSlug: "sample-academy",
    shortDescription:
      "Create a clear, professional CV that passes applicant tracking systems and highlights your real strengths.",
    description:
      "Your CV is often your first impression. This course teaches you how to structure a CV for your industry, write achievement-focused bullet points, and tailor your CV to each application.\n\nYou will also learn how applicant tracking systems (ATS) read CVs, and how to make sure yours is readable by both software and humans.",
    level: "All Levels",
    price: 35,
    duration: "6 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Structure a professional CV",
      "Write achievement-focused bullet points",
      "Tailor your CV to specific roles",
      "Optimize for applicant tracking systems",
    ],
    targetAudience: ["Job seekers", "Students", "Graduates", "Career changers"],
    whyRecommended:
      "CV writing is the foundation of every job application — a core skill for BCO's job-seeking users.",
    featured: true,
    affiliateUrl: "https://example.com/professional-cv?ref=bco",
  },
  {
    title: "How to Write a Powerful Cover Letter",
    slug: "how-to-write-a-powerful-cover-letter",
    categorySlug: "career-development",
    providerSlug: "sample-institute",
    shortDescription:
      "Write cover letters that connect your experience to the role — concise, specific and convincing.",
    description:
      "A good cover letter is short but specific. This course shows you how to research the role, choose the two or three experiences that matter most, and write a letter that reads like you — not a template.\n\nIncludes structure templates for common situations: first job, career change and returning after a break.",
    level: "Beginner",
    price: 19,
    duration: "3 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Structure a one-page cover letter",
      "Match your experience to the role",
      "Avoid clichés and generic openings",
      "Adapt one letter to many applications",
    ],
    targetAudience: ["Job seekers", "Graduates", "Career changers"],
    whyRecommended:
      "Pairs naturally with the CV course — together they cover most written job application requirements.",
    affiliateUrl: "https://example.org/powerful-cover-letters?ref=bco",
  },
  {
    title: "How to Prepare for Job Interviews",
    slug: "job-interview-success",
    categorySlug: "career-development",
    providerSlug: "global-learning-hub",
    shortDescription:
      "Prepare for interviews with structured practice: common questions, storytelling frameworks and confident delivery.",
    description:
      "Interviews are a skill you can practice. This course walks through preparation research, the most common question types, and frameworks for answering behavioral questions with real examples from your experience.\n\nIncludes guidance for virtual interviews and questions to ask the interviewer.",
    level: "All Levels",
    price: 45,
    duration: "8 hours",
    certificate: true,
    language: "English",
    format: "Instructor-led",
    learningOutcomes: [
      "Research and prepare for any interview",
      "Answer behavioral questions with structure",
      "Present strengths honestly and confidently",
      "Follow up professionally after interviews",
    ],
    targetAudience: ["Job seekers", "Internship applicants", "Young professionals"],
    whyRecommended:
      "Interview preparation is one of the most requested skills among BCO's job-seeking audience.",
    featured: true,
    affiliateUrl: "https://example.net/job-interview-success?ref=bco",
  },
  {
    title: "Free: Job Application Basics",
    slug: "job-application-basics-free",
    categorySlug: "career-development",
    providerSlug: "global-learning-hub",
    shortDescription:
      "A free primer on the job application process: where to search, what to prepare and how to stay organized.",
    description:
      "New to job hunting? This free course explains the application process end to end: where to find vacancies, what documents to prepare, how to organize your applications, and what to expect after you apply.",
    level: "Beginner",
    isFree: true,
    price: 0,
    duration: "2 hours",
    certificate: false,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Understand the end-to-end application process",
      "Prepare core application documents",
      "Track applications without stress",
    ],
    targetAudience: ["First-time job seekers", "Students"],
    whyRecommended:
      "A genuinely free starting point for users beginning their job search journey.",
    affiliateUrl: "https://example.net/free-job-basics?ref=bco",
  },

  // ---------- INTERNSHIPS ----------
  {
    title: "How to Find and Get Internships",
    slug: "how-to-find-and-get-internships",
    categorySlug: "internships",
    providerSlug: "sample-academy",
    shortDescription:
      "Find internship opportunities, prepare applications and make the most of the internship once you're in.",
    description:
      "Internships open doors — if you know how to find and win them. This course covers where to search (including hidden opportunities), how to apply with limited experience, and how to stand out in internship interviews.\n\nIt also covers workplace readiness: professionalism, asking good questions and converting an internship into a job offer.",
    level: "Beginner",
    price: 29,
    duration: "5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Find internships beyond obvious listings",
      "Apply convincingly with limited experience",
      "Prepare for internship interviews",
      "Succeed during the internship itself",
    ],
    targetAudience: ["Students", "Recent graduates", "Career starters"],
    whyRecommended:
      "Internships are a top entry point for BCO users — this covers both getting one and doing well in it.",
    affiliateUrl: "https://example.com/find-internships?ref=bco",
  },
  {
    title: "Workplace Readiness for Young Professionals",
    slug: "workplace-readiness-young-professionals",
    categorySlug: "internships",
    providerSlug: "sample-institute",
    shortDescription:
      "Build the professional habits that make interns and new hires stand out: communication, reliability and initiative.",
    description:
      "Technical skills get you hired; professional habits make you valuable. This course covers workplace communication, email etiquette, time management, receiving feedback and working in teams.\n\nDesigned for people entering their first professional environment.",
    level: "Beginner",
    price: 24,
    duration: "4.5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Communicate professionally in writing and meetings",
      "Manage time and deadlines",
      "Receive and apply feedback well",
      "Work effectively in diverse teams",
    ],
    targetAudience: ["Interns", "New hires", "Students preparing for work"],
    whyRecommended:
      "Helps BCO users not just win opportunities but thrive once selected.",
    affiliateUrl: "https://example.org/workplace-readiness?ref=bco",
  },

  // ---------- FELLOWSHIPS ----------
  {
    title: "How to Apply for Fellowships",
    slug: "how-to-apply-for-fellowships",
    categorySlug: "fellowships",
    providerSlug: "sample-academy",
    shortDescription:
      "Understand fellowship applications: eligibility, narrative essays, references and building a competitive profile.",
    description:
      "Fellowships are competitive but learnable. This course explains how fellowship selection works, how to assess your fit, and how to build an application that presents your goals and experience coherently.\n\nCovers the fellowship essay, recommendation letters and interviews, with guidance for early-career applicants.",
    level: "Intermediate",
    price: 39,
    duration: "6.5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Understand how fellowship selection works",
      "Assess fit before applying",
      "Write a compelling fellowship narrative",
      "Prepare strong references",
    ],
    targetAudience: ["Early-career professionals", "Graduates", "Emerging leaders"],
    whyRecommended:
      "Fellowships feature heavily on the main BCO platform — this prepares users to actually win them.",
    affiliateUrl: "https://example.com/fellowship-applications?ref=bco",
  },
  {
    title: "Leadership Foundations for Emerging Leaders",
    slug: "leadership-foundations-emerging-leaders",
    categorySlug: "fellowships",
    providerSlug: "global-learning-hub",
    shortDescription:
      "Develop the leadership skills fellowships and employers look for: influence, initiative and leading without authority.",
    description:
      "Leadership is not a job title. This course builds practical leadership foundations: taking initiative, influencing without authority, communicating vision and leading small teams or community projects.\n\nParticularly relevant for fellowship applicants who need to demonstrate leadership potential.",
    level: "Intermediate",
    price: 55,
    duration: "10 hours",
    certificate: true,
    language: "English",
    format: "Instructor-led",
    learningOutcomes: [
      "Lead projects and initiatives without formal authority",
      "Communicate vision and motivate peers",
      "Navigate conflict constructively",
      "Demonstrate leadership in applications and interviews",
    ],
    targetAudience: ["Fellowship applicants", "Team leads", "Community organizers"],
    whyRecommended:
      "Leadership evidence strengthens fellowship applications and career growth alike.",
    affiliateUrl: "https://example.net/leadership-foundations?ref=bco",
  },

  // ---------- REMOTE WORK ----------
  {
    title: "How to Find Remote Jobs",
    slug: "how-to-find-remote-jobs",
    categorySlug: "remote-work",
    providerSlug: "sample-academy",
    shortDescription:
      "Find legitimate remote jobs, adapt your applications for remote roles and succeed in a distributed team.",
    description:
      "Remote work is global competition — you need a focused strategy. This course covers where to find remote jobs, how to signal remote-readiness in your CV and interviews, and the practical skills remote employers test: written communication, async collaboration and self-management.",
    level: "All Levels",
    price: 39,
    duration: "7 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Find legitimate remote job sources",
      "Adapt applications for remote roles",
      "Master written and async communication",
      "Manage time and focus while working remotely",
    ],
    targetAudience: ["Job seekers", "Professionals going remote", "Freelancers"],
    whyRecommended:
      "Remote work is one of the biggest opportunity categories for BCO's global audience.",
    featured: true,
    affiliateUrl: "https://example.com/find-remote-jobs?ref=bco",
  },
  {
    title: "Digital Collaboration Tools for Teams",
    slug: "digital-collaboration-tools",
    categorySlug: "remote-work",
    providerSlug: "global-learning-hub",
    shortDescription:
      "Get confident with the tools remote teams run on: chat, video, shared documents and project boards.",
    description:
      "Remote teams live in their tools. This hands-on course introduces the categories of tools modern teams use — messaging, video meetings, document collaboration and project tracking — and how to use them professionally.\n\nSkills transfer across specific products, so you can adapt to whatever stack your team uses.",
    level: "Beginner",
    price: 15,
    duration: "3.5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Use chat and video tools professionally",
      "Collaborate on shared documents",
      "Track work on project boards",
      "Choose the right tool for each task",
    ],
    targetAudience: ["Remote workers", "Students", "New professionals"],
    whyRecommended:
      "Practical, affordable and immediately useful for anyone joining a distributed team.",
    affiliateUrl: "https://example.net/digital-collaboration?ref=bco",
  },

  // ---------- FREELANCING ----------
  {
    title: "How to Start Freelancing",
    slug: "how-to-start-freelancing",
    categorySlug: "freelancing",
    providerSlug: "sample-academy",
    shortDescription:
      "Start freelancing step by step: choose a service, set rates, find first clients and deliver professionally.",
    description:
      "Freelancing is a real career path — if you start with structure. This course walks through choosing a marketable service, setting up your profiles, pricing your work, finding your first clients and managing projects professionally.\n\nIncludes realistic guidance for beginners with no portfolio yet.",
    level: "Beginner",
    price: 35,
    duration: "8 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Choose a freelance service to offer",
      "Set up professional profiles",
      "Price your work confidently",
      "Land your first clients",
      "Deliver projects professionally",
    ],
    targetAudience: ["Beginners", "Students", "Side-hustle starters"],
    whyRecommended:
      "Freelancing is a popular income path for BCO users — this is the clearest starting course.",
    featured: true,
    affiliateUrl: "https://example.com/start-freelancing?ref=bco",
  },
  {
    title: "How to Build a Portfolio With No Experience",
    slug: "how-to-build-a-portfolio-with-no-experience",
    categorySlug: "freelancing",
    providerSlug: "sample-institute",
    shortDescription:
      "Create portfolio pieces that win clients and applications — even before you've had paid work.",
    description:
      "No experience? You can still show what you can do. This course teaches you how to create sample projects, volunteer work and case studies that demonstrate real ability, and how to present them in a simple portfolio site or document.",
    level: "Beginner",
    price: 19,
    duration: "4 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Create portfolio pieces without paid experience",
      "Document personal and volunteer projects",
      "Present work in a simple, clear portfolio",
      "Use your portfolio in pitches and applications",
    ],
    targetAudience: ["Beginners", "Career changers", "Students"],
    whyRecommended:
      "Solves the classic chicken-and-egg problem every new freelancer and job seeker faces.",
    affiliateUrl: "https://example.org/portfolio-no-experience?ref=bco",
  },
  {
    title: "Freelance Proposals and Client Acquisition",
    slug: "freelance-proposals-client-acquisition",
    categorySlug: "freelancing",
    providerSlug: "global-learning-hub",
    shortDescription:
      "Write freelance proposals that win projects and build a repeatable system for finding clients.",
    description:
      "Winning freelance work is a repeatable process. This course covers how to find client opportunities, write proposals that address the client's actual problem, follow up without being pushy, and turn one-off projects into recurring clients.",
    level: "Intermediate",
    price: 42,
    duration: "6 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Find and qualify client opportunities",
      "Write persuasive project proposals",
      "Follow up professionally",
      "Turn one-off projects into repeat clients",
    ],
    targetAudience: ["Freelancers", "Consultants", "Service providers"],
    whyRecommended:
      "The logical next step after starting out — helps freelancers build stable income.",
    affiliateUrl: "https://example.net/freelance-proposals?ref=bco",
  },

  // ---------- LINKEDIN & NETWORKING ----------
  {
    title: "How to Build a LinkedIn Profile",
    slug: "how-to-build-a-linkedin-profile",
    categorySlug: "linkedin-networking",
    providerSlug: "sample-academy",
    shortDescription:
      "Build a LinkedIn profile that attracts recruiters and opportunities: headline, about section, experience and activity.",
    description:
      "LinkedIn is where opportunities find you — when your profile is set up well. This course walks through each profile section with practical examples: writing a clear headline, an authentic about section, and experience entries that show impact.\n\nAlso covers how to network genuinely: connecting with purpose, engaging in your field and staying visible.",
    level: "Beginner",
    price: 25,
    duration: "5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Write a headline that says what you do",
      "Craft an authentic about section",
      "Present experience with impact",
      "Network with purpose, not spam",
    ],
    targetAudience: ["Job seekers", "Students", "Professionals at any stage"],
    whyRecommended:
      "A LinkedIn profile now complements every CV — essential for BCO's career-focused users.",
    affiliateUrl: "https://example.com/linkedin-profile?ref=bco",
  },
  {
    title: "Professional Networking Skills",
    slug: "professional-networking-skills",
    categorySlug: "linkedin-networking",
    providerSlug: "sample-institute",
    shortDescription:
      "Build genuine professional relationships online and in person — for opportunities, mentorship and growth.",
    description:
      "Networking is not collecting contacts; it's building relationships. This course teaches a comfortable, genuine approach: how to introduce yourself, stay in touch, offer value first, and maintain a network that supports your career long-term.",
    level: "All Levels",
    price: 22,
    duration: "3 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Introduce yourself confidently",
      "Build relationships that last",
      "Offer value before asking",
      "Maintain your network over time",
    ],
    targetAudience: ["Students", "Young professionals", "Career changers"],
    whyRecommended:
      "Networking consistently appears in fellowship, internship and job success stories.",
    affiliateUrl: "https://example.org/networking-skills?ref=bco",
  },

  // ---------- ENTREPRENEURSHIP ----------
  {
    title: "Entrepreneurship Fundamentals",
    slug: "entrepreneurship-fundamentals",
    categorySlug: "entrepreneurship",
    providerSlug: "global-learning-hub",
    shortDescription:
      "Test and launch a business idea: customers, value proposition, simple business models and first sales.",
    description:
      "Starting a business starts with evidence, not guesses. This course teaches the fundamentals: identifying a real customer problem, designing a value proposition, choosing a simple business model, and getting to first sales with minimal resources.\n\nAimed at first-time founders, especially those building with limited capital.",
    level: "Beginner",
    price: 49,
    duration: "10 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Identify real customer problems",
      "Design a clear value proposition",
      "Choose a simple business model",
      "Make your first sales",
    ],
    targetAudience: ["Aspiring founders", "Small business owners", "Students"],
    whyRecommended:
      "Supports BCO's entrepreneurship audience with practical first steps rather than hype.",
    featured: true,
    affiliateUrl: "https://example.net/entrepreneurship-fundamentals?ref=bco",
  },
  {
    title: "Business Planning for Small Businesses",
    slug: "business-planning-small-businesses",
    categorySlug: "entrepreneurship",
    providerSlug: "sample-institute",
    shortDescription:
      "Write a practical business plan you'll actually use — for funding applications and for running your business.",
    description:
      "A business plan is a thinking tool, not a formality. This course helps you write a lean, practical plan: market, operations, finances and milestones. The resulting plan works both as your roadmap and as a document for lenders or grant applications.",
    level: "Intermediate",
    price: 39,
    duration: "7 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Write a lean, practical business plan",
      "Estimate costs and revenue realistically",
      "Set milestones you can track",
      "Adapt the plan for funders and lenders",
    ],
    targetAudience: ["Small business owners", "Founders", "NGO enterprise projects"],
    whyRecommended:
      "Complements grant writing skills — many funders require a business plan.",
    affiliateUrl: "https://example.org/business-planning?ref=bco",
  },

  // ---------- INTERNATIONAL OPPORTUNITIES ----------
  {
    title: "How to Apply for International Opportunities",
    slug: "how-to-apply-for-international-opportunities",
    categorySlug: "international-opportunities",
    providerSlug: "sample-academy",
    shortDescription:
      "Navigate international applications — exchanges, programs and global jobs — with the right preparation and documents.",
    description:
      "International opportunities have extra layers: eligibility rules, documents, time zones and cross-cultural expectations. This course helps you assess which international programs fit you, prepare the required documents, and present yourself well across cultures.",
    level: "All Levels",
    price: 32,
    duration: "5.5 hours",
    certificate: true,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Assess fit for international programs",
      "Prepare standard international documents",
      "Understand cross-cultural application norms",
      "Plan realistically for logistics and costs",
    ],
    targetAudience: ["Students", "Young professionals", "Global job seekers"],
    whyRecommended:
      "Directly relevant to BCO's core mission of connecting users to international opportunities.",
    affiliateUrl: "https://example.com/international-opportunities?ref=bco",
  },
  {
    title: "Free: Working Across Cultures",
    slug: "working-across-cultures-free",
    categorySlug: "international-opportunities",
    providerSlug: "global-learning-hub",
    shortDescription:
      "A free introduction to cross-cultural communication for international teams, programs and studies.",
    description:
      "This free mini-course introduces the basics of working across cultures: communication styles, giving and receiving feedback across cultures, and avoiding common misunderstandings in international teams.",
    level: "Beginner",
    isFree: true,
    price: 0,
    duration: "2 hours",
    certificate: false,
    language: "English",
    format: "Self-paced",
    learningOutcomes: [
      "Recognize different communication styles",
      "Adapt feedback across cultures",
      "Avoid common cross-cultural misunderstandings",
    ],
    targetAudience: ["Students", "Remote workers", "Exchange participants"],
    whyRecommended:
      "A free, useful primer for anyone preparing for international programs or remote international teams.",
    affiliateUrl: "https://example.net/working-across-cultures?ref=bco",
  },
];

async function main() {
  console.log("Seeding BCO Courses database...");

  // Idempotent: clear existing data first
  await db.courseClick.deleteMany();
  await db.courseView.deleteMany();
  await db.course.deleteMany();
  await db.category.deleteMany();
  await db.provider.deleteMany();

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await db.category.create({
      data: { ...cat, showOnHome: true },
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`✔ ${categories.length} categories`);

  const providerMap = new Map<string, string>();
  for (const prov of providers) {
    const created = await db.provider.create({ data: prov });
    providerMap.set(prov.slug, created.id);
  }
  console.log(`✔ ${providers.length} providers`);

  let featuredCount = 0;
  for (const course of courses) {
    const categoryId = categoryMap.get(course.categorySlug);
    const providerId = providerMap.get(course.providerSlug);
    if (!categoryId || !providerId) {
      throw new Error(`Missing category or provider for ${course.title}`);
    }
    const { categorySlug, providerSlug, ...data } = course;
    await db.course.create({
      data: {
        ...data,
        categoryId,
        providerId,
        learningOutcomes: JSON.stringify(data.learningOutcomes),
        targetAudience: JSON.stringify(data.targetAudience),
        featured: data.featured ?? false,
        lastVerified: new Date(),
      },
    });
    if (data.featured) featuredCount += 1;
  }
  console.log(`✔ ${courses.length} sample courses (${featuredCount} featured)`);
  console.log("\nDone. Replace sample data via /admin before going live.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
