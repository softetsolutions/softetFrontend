// MatTax Images 
import mattaxDashboard from "../assets/Dashboard.png";
import invoiceUpload from "../assets/add_transaction.png";
import mattaxReport from "../assets/report.png";
import transaction from "../assets/transaction.png";
import mattaxProfile from "../assets/profile.png";
import mattaxLoginSignup from "../assets/login_signup.png";

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
];

export default projectData;
