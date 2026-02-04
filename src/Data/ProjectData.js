// MatTax Images
import mattaxDashboard from "../assets/Dashboard.png";
import invoiceUpload from "../assets/add_transaction.png";
import mattaxReport from "../assets/report.png";
import transaction from "../assets/transaction.png";
import mattaxProfile from "../assets/profile.png";
import mattaxLoginSignup from "../assets/login_signup.png";

// B4Boosting images
import B4BoostingMainImg from "../assets/B4Boosting_Main_Image.jpg";

const projectData = [
  {
    slug: "mattax-smart-ledger",
    title: "MatTax – Smart Ledger & Tax Automation Platform",
    tagline:
      "Automate bookkeeping, tax records, and document processing for modern businesses",

    description:
      "MatTax is a secure, cloud-based ledger and tax management platform designed to help individuals, accountants, and small businesses manage invoices, expenses, and tax-ready records with ease.",

    detailedDescription:
      "MatTax is a full-stack SaaS platform that digitizes financial record-keeping by combining secure authentication, document uploads, OCR-based data extraction, and structured ledger management. The system is designed for accuracy, compliance, and scalability, enabling users to transition from manual bookkeeping to an automated, audit-ready workflow.",

    image: [
      mattaxDashboard,
      mattaxLoginSignup,
      transaction,
      invoiceUpload,
      mattaxReport,
      mattaxProfile,
    ],

    projectUrl: "https://matledger.com",
    githubUrl: null,

    overview:
      "Manual bookkeeping, scattered invoices, and unstructured expense records create errors and tax-time stress for individuals and accountants. MatTax centralizes financial data into a single, secure ledger system that transforms raw documents into structured, usable records.",

    problem:
      "Businesses and professionals struggle with managing invoices, receipts, and tax data across multiple tools, spreadsheets, and physical documents, leading to inefficiency, errors, and compliance risks.",

    targetUsers:
      "Individual professionals, small business owners, accountants, tax consultants, and finance teams who require accurate, organized, and audit-ready financial records.",

    features: [
      {
        title: "Digital Ledger Management",
        description:
          "Maintain structured income and expense records in a centralized, searchable ledger.",
        benefit:
          "Eliminates manual bookkeeping errors and ensures consistent financial records",
      },
      {
        title: "Invoice & Receipt Upload",
        description:
          "Upload invoices and receipts in image, PDF, or CSV formats directly to the platform.",
        benefit: "Saves time by removing manual data entry",
      },
      {
        title: "Smart Data Extraction",
        description:
          "Automatically extracts key financial details from uploaded documents.",
        benefit: "Converts unstructured documents into tax-ready records",
      },
      {
        title: "Role-Based Access",
        description:
          "Separate access for personal users and accountants with controlled permissions.",
        benefit:
          "Secure collaboration between clients and accounting professionals",
      },
      {
        title: "Secure Authentication & Verification",
        description:
          "Multi-layer authentication and verification mechanisms protect sensitive data.",
        benefit: "Builds trust and ensures financial data safety",
      },
      {
        title: "Export & Reporting",
        description:
          "Generate downloadable reports for audits, tax filing, or financial reviews.",
        benefit: "Simplifies compliance and financial analysis",
      },
    ],

    techStack: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Express",
      "Tailwind CSS",
      "JWT Authentication",
    ],

    detailedTechStack: {
      frontend: [
        "React 19",
        "Vite",
        "Tailwind CSS v4",
        "React Router v7",
        "JWT Decode",
        "React Dropzone",
        "ReCAPTCHA",
      ],
      backend: [
        "Node.js (ESM)",
        "Express.js",
        "RESTful APIs",
        "JWT & Cookie-based Authentication",
        "File Upload Handling",
      ],
      database: [
        "PostgreSQL",
        "Relational Schema Design",
        "Secure Query Handling",
      ],
      tools: ["Git", "VS Code", "Postman", "ESLint", "dotenv"],
      deployment: [
        "Cloud Hosting",
        "Secure Environment Configuration",
        "Production-ready API setup",
      ],
    },

    challenges: [
      {
        problem:
          "Managing sensitive financial data securely across multiple user roles",
        solution:
          "Implemented layered authentication and strict access control at the API level",
        tech: "JWT, Cookies, Role-Based Authorization",
        impact: "Prevented unauthorized access to financial records",
        result:
          "Established a trust-first architecture suitable for financial applications",
      },
      {
        problem: "Handling unstructured invoice and receipt data efficiently",
        solution:
          "Integrated document processing pipeline to convert uploaded files into structured data",
        tech: "File Uploads, OCR Processing, Data Normalization",
        impact: "Manual data entry was slow and error-prone",
        result: "Reduced record creation time by more than 70%",
      },
      {
        problem: "Designing a scalable ledger model for long-term use",
        solution: "Used a normalized relational schema with PostgreSQL",
        tech: "PostgreSQL, SQL Optimization",
        impact: "Flat data models failed with growing datasets",
        result: "System remains performant as user data scales",
      },
    ],

    metrics: {
      performance:
        "Optimized API response times with efficient queries and caching strategies",
      security: "Secure authentication flows and encrypted data handling",
      scalability: "Designed to support thousands of concurrent users",
      accessibility:
        "Responsive UI with keyboard navigation and readable layouts",
    },

    impact: {
      efficiency: "Reduced bookkeeping effort from hours to minutes per week",
      accuracy: "Improved financial data consistency and audit readiness",
      adoption:
        "Validated through real-world usage scenarios and accountant feedback",
    },

    timeline:
      "End-to-end development including planning, implementation, and testing",

    team: "Full-stack development and system architecture by a single developer",
  },

  {
    slug: "b4boosting-gaming-services-platform",

    title: "B4Boosting – Gaming Boosting & Digital Services Marketplace",

    tagline:
      "Fast, secure, and professional boosting services for competitive gamers",

    description:
      "B4Boosting is an online gaming services platform that allows players to purchase boosting, in-game currency, accounts, items, and coaching services across popular multiplayer games through a streamlined and secure marketplace.",

    detailedDescription:
      "B4Boosting is a digital marketplace designed for gamers who want to save time, overcome skill barriers, or accelerate in-game progress. The platform connects users with professional boosters and service providers, offering rank boosting, power leveling, in-game currency delivery, account services, and game-related digital products. Built with a user-first approach, B4Boosting focuses on fast delivery, order transparency, and 24/7 customer support while maintaining a clean and intuitive purchasing experience.",

    image: [B4BoostingMainImg],

    projectUrl: "https://b4boosting.com",
    githubUrl: null,

    overview:
      "Competitive online games often require significant time investment, advanced skill levels, or repetitive grinding to progress. B4Boosting centralizes professional gaming services into a single platform, enabling players to quickly access boosting, digital goods, and expert assistance without navigating unreliable third-party sources.",

    problem:
      "Many gamers struggle with slow progression, skill-based rank barriers, and time constraints. Existing solutions are fragmented, untrustworthy, or lack customer support, leading to poor user experiences and high risk of scams.",

    targetUsers:
      "Casual gamers, competitive players, esports enthusiasts, and busy individuals who want faster in-game progression, higher ranks, rare items, or professional assistance without investing excessive time.",

    features: [
      {
        title: "Game Boosting Services",
        description:
          "Professional rank boosting, power leveling, and progression services for supported games.",
        benefit:
          "Helps players reach desired ranks or milestones quickly and efficiently",
      },
      {
        title: "In-Game Currency & Items",
        description:
          "Purchase in-game currency, items, and digital assets with fast delivery.",
        benefit: "Eliminates repetitive grinding and saves valuable playtime",
      },
      {
        title: "Account & Top-Up Services",
        description:
          "Secure account-based services and game top-ups with guided order flow.",
        benefit: "Provides convenient access to premium game features",
      },
      {
        title: "User Dashboard & Order Tracking",
        description:
          "Centralized dashboard to manage orders, track progress, and view order history.",
        benefit: "Improves transparency and user trust during service delivery",
      },
      {
        title: "24/7 Customer Support",
        description:
          "Always-available live support to resolve issues and answer user queries.",
        benefit:
          "Ensures smooth service experience and faster issue resolution",
      },
      {
        title: "Secure Payments & Refund Policy",
        description:
          "Protected payment gateways with a money-back guarantee policy.",
        benefit: "Builds confidence and reduces purchase risk for users",
      },
    ],

    techStack: [
      "Next.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "JWT Authentication",
    ],

    detailedTechStack: {
      frontend: [
        "Next.js",
        "Vite",
        "Tailwind CSS",
        "Responsive UI Design",
        "Axios for API communication",
      ],
      backend: [
        "Node.js",
        "Express.js",
        "RESTful APIs",
        "JWT-based Authentication",
        "Order & Service Management Logic",
      ],
      database: [
        "MongoDB",
        "Structured Order & User Schema",
        "Secure Data Handling",
      ],
      tools: ["Git", "VS Code", "Postman"],
      deployment: [
        "Cloud Hosting",
        "Production Environment Setup",
        "Secure Payment Integration",
      ],
    },

    challenges: [
      {
        problem:
          "Building trust in a market prone to scams and unreliable service providers",
        solution:
          "Introduced order tracking, clear service descriptions, and refund policies",
        tech: "Order Status System, Secure Payments",
        impact: "Reduced user hesitation and increased purchase confidence",
        result: "Higher conversion rate and repeat customers",
      },
      {
        problem: "Managing multiple service types across different games",
        solution:
          "Designed a flexible service architecture with modular categories",
        tech: "Dynamic Service Models, REST APIs",
        impact: "Hardcoded systems failed to scale with new games",
        result:
          "Platform easily expands to support additional games and services",
      },
      {
        problem:
          "Ensuring smooth communication between users and service delivery",
        solution:
          "Integrated real-time support and clear order lifecycle updates",
        tech: "Live Support Integration, Order Status Updates",
        impact: "Users lacked clarity during service execution",
        result: "Improved user satisfaction and reduced disputes",
      },
    ],

    metrics: {
      performance:
        "Optimized service listing and order flows for fast page loads",
      security:
        "Secure authentication, protected payment flows, and user data handling",
      scalability: "Service-based architecture supports platform growth",
      accessibility:
        "Mobile-friendly UI with clear navigation and readable layouts",
    },

    impact: {
      efficiency: "Saved users hours or days of in-game grinding",
      experience: "Provided a single trusted destination for gaming services",
      adoption:
        "Designed to attract repeat users through reliability and support",
    },

    timeline:
      "Planned, designed, and launched as a production-ready gaming services platform",

    team: "Platform architecture, frontend, and backend developed by a small dedicated team",
  },
];

export default projectData;
