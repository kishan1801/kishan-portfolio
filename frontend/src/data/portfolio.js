// Single source of truth for public portfolio content.
// Keep employment and independent project experience clearly distinguished.

export const PROFILE = {
  name: "Kishan Kumar",
  monogram: "KK",
  roles: ["Full-Stack Developer", "MERN Stack Developer", "Backend Developer"],
  location: "Bengaluru, India",
  openToWork: true,
  intro:
    "I build practical web applications and backend systems, with hands-on experience from independent projects and a clear goal: to earn my first professional software development role.",
  about: [
    "I'm a BCA graduate from CMR University, Bengaluru, and a full-stack developer trained through 10x Academy. I enjoy understanding how applications work under the hood, from data modelling and API design to responsive interfaces.",
    "My hands-on project work includes an e-commerce application with a simulated HMAC-SHA256 payment-verification flow, a recipe app with Cloudinary image delivery, and a real-estate platform with role-based access, AWS S3 pre-signed URLs, and Socket.IO updates.",
    "I'm actively seeking my first company-based software development role or internship. My technical experience comes from building, debugging, and deploying projects independently; I don't present those projects as full-time company employment.",
  ],
  emails: ["k.kishankg120@gmail.com", "kishan1801@zohomail.in"],
  github: "https://github.com/kishan1801",
  linkedin: "https://www.linkedin.com/in/kishan-kumar-23a2012a4/",
  resumeUrl: "/resume.pdf",
  stats: [
    { value: "3", label: "Featured full-stack projects" },
    { value: "MERN", label: "Primary development stack" },
    { value: "2024", label: "BCA graduate" },
    { value: "Open", label: "To entry-level roles & internships" },
  ],
};

export const SKILLS = [
  {
    id: "frontend",
    label: "Frontend",
    items: ["JavaScript (ES6+)", "React.js", "HTML5 & CSS3", "Tailwind CSS", "React Router DOM", "Context API", "Responsive UI"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Express.js", "REST API design", "JWT authentication", "Role-based access control", "Zod validation", "Socket.IO"],
  },
  {
    id: "data-cloud",
    label: "Data & Cloud",
    items: ["MongoDB & Mongoose", "PostgreSQL / Supabase", "Prisma ORM", "AWS S3 pre-signed URLs", "Cloudinary", "Multer", "HMAC-SHA256"],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    items: ["Git & GitHub", "Postman", "Vercel", "Netlify", "Render", "npm", "VS Code"],
  },
];

export const PROJECTS = [
  {
    id: "payshop",
    title: "PayShop",
    category: "E-commerce · Personal Project",
    period: "Feb 2026 – Mar 2026",
    tagline:
      "A full-stack e-commerce application focused on secure order flows, access control, and reliable inventory updates.",
    problem:
      "An e-commerce flow must distinguish a verified payment response from a client-side claim, protect user/admin operations, and avoid overselling when multiple orders compete for stock.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "bcrypt", "HMAC-SHA256"],
    features: [
      "Full-stack e-commerce application with MongoDB persistence",
      "JWT-protected REST API routes and bcrypt password hashing",
      "Role-based access for user and admin operations",
      "Backend HMAC-SHA256 signature verification for a simulated payment flow",
      "Atomic stock deduction logic to reduce overselling risk during concurrent orders",
    ],
    architecture:
      "A React frontend communicates with a Node.js/Express REST API and MongoDB. The backend verifies the signature for the simulated payment flow using HMAC-SHA256, rather than trusting a client-side success state. Authentication and role checks protect sensitive API routes.",
    challenges: [
      {
        title: "Trusting the server, not the browser",
        detail:
          "The payment exercise recreates and verifies a signature on the backend so an order is not considered paid solely because the client reports success. This is a simulated payment flow, not a claim of live production payment processing.",
      },
      {
        title: "Keeping inventory consistent",
        detail:
          "Stock changes need to be guarded on the server so concurrent order attempts cannot simply read the same old quantity and oversell it.",
      },
    ],
    live: "https://payment-practice-frontend.vercel.app/login",
    frontendUrl: "https://github.com/kishan1801/payment-practice-frontend",
    backendUrl: "https://github.com/kishan1801/payment-practice-backend",
    github: "https://github.com/kishan1801/payment-practice-frontend",
    accent: "violet",
    tags: ["Full Stack", "Backend", "Security"],
    disclaimer: "Independent personal project. Payment verification is simulated; no live payment processing is claimed.",
  },
  {
    id: "recipe-application",
    title: "Recipe App",
    category: "Full-Stack Web Application",
    period: "Dec 2025 – Jan 2026",
    tagline:
      "A recipe application with secure user sessions, public recipe discovery, and cloud-hosted images.",
    problem:
      "An image-heavy application needs a clean way to upload and deliver media without placing image binaries inside the database or slowing down common browsing flows.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Multer", "Cloudinary", "Tailwind CSS"],
    features: [
      "Recipe CRUD and role-aware recipe management",
      "JWT authentication for protected user actions",
      "Public recipe browsing and search",
      "Multer middleware and Cloudinary-hosted image assets",
      "Responsive React interface deployed separately from the API",
    ],
    architecture:
      "The React frontend consumes an Express API backed by MongoDB. Multer handles incoming upload requests while Cloudinary stores and serves image assets; database documents retain image URLs instead of large binary files.",
    challenges: [
      {
        title: "Keeping image storage out of the database",
        detail:
          "Cloudinary URLs are stored with recipe data, avoiding large image payloads in MongoDB and allowing the CDN to deliver assets independently.",
      },
    ],
    live: "https://recipe-app-frontend-steel.vercel.app/",
    frontendUrl: "https://github.com/kishan1801/recipe_app_frontend",
    backendUrl: "https://github.com/kishan1801/1-recipe-app-backend",
    github: "https://github.com/kishan1801/recipe_app_frontend",
    accent: "cyan",
    tags: ["Full Stack", "React", "Cloudinary", "Cloud"],
  },
  {
    id: "real-estate-platform",
    title: "Habitat Digital",
    category: "Full-Stack Real Estate Platform",
    period: "Sep 2025 – Nov 2025",
    tagline:
      "A property listing platform with distinct Owner, Agent, and Admin access, private media delivery, and live view counts.",
    problem:
      "Real-estate applications need distinct permissions for different users, dependable property discovery, safe media handling, and engagement counts that update without constant polling.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "AWS S3", "Socket.IO"],
    features: [
      "Role-based Owner, Agent, and Admin workflows",
      "JWT-protected APIs with role-aware permissions",
      "Property search, pagination, and property detail endpoints",
      "AWS S3 pre-signed URLs for controlled image access",
      "Socket.IO real-time property view-count updates with server-side deduplication",
    ],
    architecture:
      "A React client communicates with an Express API backed by MongoDB/Mongoose. JWT middleware protects writes and role-specific actions. File access uses server-generated S3 pre-signed URLs, and Socket.IO sends view-count updates to clients in the relevant property room.",
    challenges: [
      {
        title: "Private file storage with convenient access",
        detail:
          "S3 pre-signed URLs let the application keep stored objects private while issuing time-limited URLs when a permitted user needs to view an image.",
      },
      {
        title: "Avoiding inflated real-time view counts",
        detail:
          "The view-count implementation uses server-side handling and Socket.IO updates to reduce duplicate counting and avoid polling from every browser.",
      },
    ],
    live: "https://habitat-digital.netlify.app/login",
    frontendUrl: "https://github.com/kishan1801/real-estate-frontend",
    backendUrl: "https://github.com/kishan1801/real-estate-backend",
    github: "https://github.com/kishan1801/real-estate-frontend",
    accent: "blue",
    tags: ["Full Stack", "Backend", "Real-time", "Cloud"],
  },
];

export const TIMELINE = [
  {
    period: "Jun 2024",
    title: "BCA — CMR University, Bengaluru",
    type: "Education",
    detail: "Completed a Bachelor of Computer Applications with a foundation in computer science, databases, and software development. CGPA: 7.78/10.",
  },
  {
    period: "Oct 2024 – Present",
    title: "Full-Stack Development Training — 10x Academy",
    type: "Training",
    detail: "MERN stack training and project-based practice across React, Node.js, Express, MongoDB, REST API design, and deployment.",
  },
  {
    period: "2025 – Present",
    title: "Independent Full-Stack Project Development",
    type: "Personal Projects",
    detail: "Built and deployed portfolio projects including PayShop, Recipe App, and Habitat Digital. This is hands-on independent project experience, not company employment.",
  },
  {
    period: "Jun 2026 – Present",
    title: "Independent Finance Research Consultant — WorldQuant BRAIN",
    type: "Independent Research",
    detail: "Exploring quantitative finance research, alpha development, and simulations on the WorldQuant BRAIN platform; completed the Quantitative Finance Starter Level in June 2026. This is separate from software-engineering employment.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7467953990568194048/",
    urlLabel: "View LinkedIn announcement",
  },
  {
    period: "Currently",
    title: "Seeking My First Software Developer Role",
    type: "Open to Work",
    detail: "Open to entry-level software development roles, internships, and junior backend/full-stack opportunities where I can contribute and grow with an engineering team.",
  },
];

export const JOURNAL_TOPICS = [
  "What Socket.IO taught me about real-time state",
  "Designing MongoDB schemas for a property platform",
  "Why pre-signed URLs beat public S3 buckets",
];

export const SUGGESTED_QUESTIONS = [
  "Tell me about Kishan and the first tech role he is looking for.",
  "Explain the Habitat Digital project and its architecture.",
  "How does PayShop simulate payment signature verification?",
  "What backend technologies does he use?",
  "Tell me about the Recipe App.",
  "What is Kishan doing with WorldQuant BRAIN?",
  "Show me the project repositories and live demos.",
  "How can I contact him or download his resume?",
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "AI", href: "#ask-kishan-ai" },
  { label: "Journey", href: "#journey" },
  { label: "Journal", href: "#journal" },
];
