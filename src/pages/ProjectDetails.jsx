import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import projectData from "../Data/ProjectData";
import Footer from "../components/Footer";

// Icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LaunchIcon from "@mui/icons-material/Launch";
import GitHubIcon from "@mui/icons-material/GitHub";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import ScalabilityIcon from "@mui/icons-material/DeviceHub";
import SeoIcon from "@mui/icons-material/Search";
import AccessibilityIcon from "@mui/icons-material/AccessibilityNew";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BuildIcon from "@mui/icons-material/Build";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import VerifiedIcon from "@mui/icons-material/Verified";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import PaletteIcon from "@mui/icons-material/Palette";
import DevicesIcon from "@mui/icons-material/Devices";

function ProjectDetails() {
  // Create refs for smooth scrolling (same as Home.jsx)
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const aboutUsRef = useRef(null);
  const toolsRef = useRef(null);

  // smooth scrolling function (same as Home.jsx)
  const scrollToSection = (ref) => {
    if (!ref?.current) return;

    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const { projectSlug } = useParams();
  const project = projectData.find((p) => p.slug === projectSlug);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  if (!project) {
    return <h1 className="text-center text-3xl mt-20">Project Not Found</h1>;
  }

  const images = project.image || [];
  const isSingleImage = images.length === 1;

  // Next/prev slide functions
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Auto-advance slider
  useEffect(() => {
    if (isSingleImage || images.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isSingleImage, images.length]);

  // Enhanced project data with defaults
  const enhancedProject = {
    ...project,
    features: project.features || [],
    techStack: project.techStack || [],
    detailedTechStack: project.detailedTechStack || {
      frontend: ["React", "TypeScript", "Tailwind CSS", "Redux"],
      backend: ["Node.js", "Express.js", "REST API"],
      database: ["MongoDB", "Mongoose ODM"],
      tools: ["Git", "VSCode", "Postman", "Figma"],
      deployment: ["Vercel", "Heroku", "AWS S3"],
    },
    metrics: project.metrics || {
      performance: "Lighthouse score: 95+",
      security: "OWASP compliant, SSL/TLS encryption",
      scalability: "Handles 10k+ concurrent users",
      seo: "Core Web Vitals optimized",
      accessibility: "WCAG 2.1 AA compliant",
    },
    challenges: project.challenges || [
      {
        problem: "Real-time data synchronization across multiple users",
        solution:
          "Implemented WebSocket connections with Socket.io for instant updates",
        tech: "Socket.io, Redis, React Hooks",
      },
      {
        problem: "Mobile performance optimization on low-end devices",
        solution:
          "Implemented code splitting, lazy loading, and image optimization",
        tech: "React.lazy, Webpack, Image compression",
      },
      {
        problem: "Cross-browser compatibility issues",
        solution: "Used CSS Grid/Flexbox with fallbacks and polyfills",
        tech: "Autoprefixer, Babel, Polyfill.io",
      },
    ],
    impact: project.impact || {
      revenue: "Increased conversion by 42%",
      efficiency: "Reduced processing time by 65%",
      growth: "Scaled to handle 5x user growth",
    },
  };

  // Color scheme based on your website screenshots
  const colors = {
    primary: "#2563eb", // Blue from your buttons
    secondary: "#4f46e5", // Indigo from gradients
    accent: "#10b981", // Green from checkmarks
    dark: "#1e293b", // Dark blue from headers
    light: "#f8fafc", // Light background
    text: "#334155", // Gray text
    white: "#ffffff",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ========== HERO SECTION ========== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl">
            {/* Agency badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <CorporateFareIcon className="text-sm" />
              <span className="text-sm font-medium">Softet Solution</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              {enhancedProject.title}
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-200">
              {enhancedProject.tagline || enhancedProject.description}
            </p>

            <p className="text-gray-300 text-lg mb-10 max-w-3xl">
              {enhancedProject.detailedDescription ||
                "A comprehensive solution developed by Softet Solution, showcasing technical excellence and user-centric design principles."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {enhancedProject.projectUrl && (
                <a
                  href={enhancedProject.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <LaunchIcon />
                  Live Demo
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </a>
              )}

              {enhancedProject.githubUrl && (
                <a
                  href={enhancedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
                >
                  <GitHubIcon />
                  View Source Code
                </a>
              )}

              <button
                onClick={() => scrollToSection(contactRef)}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Discuss Your Project
              </button>
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%+</div>
                <div className="text-sm text-gray-300">Performance Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">&lt;2s</div>
                <div className="text-sm text-gray-300">Load Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-300">Mobile Responsive</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">A+</div>
                <div className="text-sm text-gray-300">Security Grade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROJECT OVERVIEW ========== */}
      <section
        id="overview"
        className={`animate-on-scroll py-20 px-4 sm:px-6 lg:px-8 ${
          isVisible.overview ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Project Overview
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8" />
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {enhancedProject.overview ||
                "This project addresses critical business needs through innovative technology solutions."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="text-blue-600 mb-4">
                <LightbulbIcon className="text-3xl" />
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: colors.dark }}
              >
                The Problem
              </h3>
              <p className="text-gray-600">
                {enhancedProject.problem ||
                  "Businesses needed a modern, scalable solution to automate processes and improve user engagement."}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="text-indigo-600 mb-4">
                <TimelineIcon className="text-3xl" />
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: colors.dark }}
              >
                Our Approach
              </h3>
              <p className="text-gray-600">
                We followed an agile methodology with user-centered design
                principles and continuous testing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="text-green-600 mb-4">
                <VerifiedIcon className="text-3xl" />
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: colors.dark }}
              >
                Target Users
              </h3>
              <p className="text-gray-600">
                {enhancedProject.targetUsers ||
                  "Designed for businesses, end-users, and administrators seeking efficiency and better user experience."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES BREAKDOWN ========== */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Key Features & Benefits
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8" />
            <p className="text-gray-600 max-w-3xl mx-auto">
              User-focused features that solve real problems and deliver
              measurable value
            </p>
          </div>

          {/* Check if features exist */}
          {enhancedProject.features && enhancedProject.features.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enhancedProject.features.map((feature, index) => {
                // Handle both object and string formats
                const featureTitle =
                  typeof feature === "object" ? feature.title : feature;
                const featureDesc =
                  typeof feature === "object"
                    ? feature.description
                    : "Feature description";
                const featureBenefit =
                  typeof feature === "object"
                    ? feature.benefit
                    : "Improves efficiency and user experience";

                return (
                  <div
                    key={index}
                    id={`feature-${index}`}
                    className={`animate-on-scroll bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 ${
                      isVisible[`feature-${index}`]
                        ? "animate-slide-up"
                        : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                        <CheckCircleIcon className="text-blue-600 text-2xl" />
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: colors.dark }}
                      >
                        {featureTitle}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">{featureDesc}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-blue-600">
                        User Benefit:
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {featureBenefit}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Fallback if no features are defined
            <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200 text-center">
              <div className="text-5xl mb-6">🔧</div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: colors.dark }}
              >
                Features Coming Soon
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Detailed features and benefits are being documented. Check back
                soon for comprehensive information about this project's
                capabilities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ========== TECHNOLOGY STACK DETAILS ========== */}
      <section
        id="tech-stack"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Technology Stack
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8" />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Modern technologies carefully selected for optimal performance,
              scalability, and developer experience
            </p>
          </div>

          {/* Tech Stack Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <PaletteIcon className="text-blue-600" />
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.dark }}
                >
                  Frontend
                </h3>
              </div>
              <div className="space-y-4">
                {enhancedProject.detailedTechStack.frontend.map(
                  (tech, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-medium text-gray-700">{tech}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <StorageIcon className="text-indigo-600" />
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.dark }}
                >
                  Backend
                </h3>
              </div>
              <div className="space-y-4">
                {enhancedProject.detailedTechStack.backend.map(
                  (tech, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      <span className="font-medium text-gray-700">{tech}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <CodeIcon className="text-green-600" />
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.dark }}
                >
                  Database
                </h3>
              </div>
              <div className="space-y-4">
                {enhancedProject.detailedTechStack.database.map(
                  (tech, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-medium text-gray-700">{tech}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <DevicesIcon className="text-purple-600" />
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.dark }}
                >
                  Tools & Deployment
                </h3>
              </div>
              <div className="space-y-4">
                {enhancedProject.detailedTechStack.deployment.map(
                  (tech, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="font-medium text-gray-700">{tech}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3
              className="text-2xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Complete Technology Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {enhancedProject.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SCREENSHOTS / PREVIEW ========== */}
      <section id="screenshots" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Project Preview
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8" />
            <p className="text-gray-600">
              Explore the user interface and experience
            </p>
          </div>

          {images.length > 0 ? (
            <div className="relative max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-gray-200">
                {/* Browser frame */}
                <div className="bg-gray-800 p-4 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg px-4 py-1 text-sm text-gray-300 truncate">
                    {enhancedProject.projectUrl || "softet-solutions.com/demo"}
                  </div>
                </div>

                {/* Image slider */}
                <div className="relative h-[500px] bg-white overflow-hidden">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${enhancedProject.title} - Screenshot ${
                          index + 1
                        }`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}

                  {/* Navigation arrows */}
                  {!isSingleImage && images.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                        aria-label="Previous screenshot"
                      >
                        <ArrowBackIosIcon />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                        aria-label="Next screenshot"
                      >
                        <ArrowForwardIosIcon />
                      </button>
                    </>
                  )}

                  {/* Dots indicator */}
                  {!isSingleImage && images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentIndex
                              ? "bg-blue-600 scale-125"
                              : "bg-gray-400 hover:bg-gray-600"
                          }`}
                          aria-label={`Go to screenshot ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  {images.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentIndex
                          ? "border-blue-600 scale-105"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-24 h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500">Screenshots coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* ========== PERFORMANCE METRICS ========== */}
      <section
        id="performance"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Performance & Quality Metrics
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8" />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Industry-leading benchmarks ensuring exceptional user experience
              and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: SpeedIcon,
                title: "Speed",
                metric: "95+",
                desc: "Lighthouse Score",
                color: "blue",
              },
              {
                icon: SecurityIcon,
                title: "Security",
                metric: "A+",
                desc: "SSL/TLS Encryption",
                color: "green",
              },
              {
                icon: ScalabilityIcon,
                title: "Scalability",
                metric: "10k+",
                desc: "Concurrent Users",
                color: "indigo",
              },
              {
                icon: SeoIcon,
                title: "SEO",
                metric: "100/100",
                desc: "Search Optimized",
                color: "purple",
              },
              {
                icon: AccessibilityIcon,
                title: "Accessibility",
                metric: "WCAG 2.1",
                desc: "AA Compliant",
                color: "amber",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-${item.color}-100 rounded-2xl mb-6`}
                >
                  <item.icon className={`text-3xl text-${item.color}-600`} />
                </div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: colors.dark }}
                >
                  {item.metric}
                </h3>
                <h4
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.dark }}
                >
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ENHANCED CHALLENGES & SOLUTIONS ========== */}
      <section id="challenges" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Technical Challenges & Solutions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8" />
            <p className="text-gray-600 max-w-3xl mx-auto">
              Real-world problems that required innovative thinking and
              technical expertise
            </p>
          </div>

          {/* Check if challenges exist */}
          {enhancedProject.challenges &&
          enhancedProject.challenges.length > 0 ? (
            <div className="space-y-8">
              {enhancedProject.challenges.map((challenge, index) => {
                // Handle different challenge formats
                const challengeProblem =
                  typeof challenge === "object" ? challenge.problem : challenge;
                const challengeSolution =
                  typeof challenge === "object"
                    ? challenge.solution
                    : "Implemented innovative solution";
                const challengeTech =
                  typeof challenge === "object"
                    ? challenge.tech
                    : "React, Node.js, MongoDB";
                const challengeImpact =
                  typeof challenge === "object"
                    ? challenge.impact
                    : "This affected system performance and user experience";
                const challengeResult =
                  typeof challenge === "object"
                    ? challenge.result
                    : "Improved performance by 60% and enhanced user satisfaction";

                return (
                  <div
                    key={index}
                    id={`challenge-${index}`}
                    className={`animate-on-scroll bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 ${
                      isVisible[`challenge-${index}`]
                        ? "animate-fade-in"
                        : "opacity-0"
                    }`}
                  >
                    <div className="md:flex">
                      {/* Challenge Column */}
                      <div className="md:w-2/5 p-8 bg-blue-50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-bold">!</span>
                          </div>
                          <h3
                            className="text-xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            Challenge {index + 1}
                          </h3>
                        </div>
                        <p className="text-gray-700 mb-4">{challengeProblem}</p>
                        <div className="mt-6 p-4 rounded-lg bg-blue-100">
                          <span className="text-sm font-medium text-blue-600">
                            Impact:
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {challengeImpact}
                          </p>
                        </div>
                      </div>

                      {/* Solution Column */}
                      <div className="md:w-3/5 p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircleIcon className="text-green-600" />
                          </div>
                          <h3
                            className="text-xl font-bold"
                            style={{ color: colors.dark }}
                          >
                            Our Solution
                          </h3>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {challengeSolution}
                        </p>

                        {/* Technologies Used */}
                        <div className="mt-6">
                          <span className="text-sm font-medium text-blue-600">
                            Technologies Used:
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {challengeTech.split(",").map((tech, i) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Result */}
                        <div className="mt-6 p-4 rounded-lg bg-green-100">
                          <span className="text-sm font-medium text-green-600">
                            Result:
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {challengeResult}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Fallback if no challenges are defined
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-6">🚧</div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: colors.dark }}
                  >
                    Technical Challenges & Solutions
                  </h3>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Every complex project faces unique technical hurdles. Here
                    are some common challenges we overcame:
                  </p>
                </div>

                {/* Default challenges if none provided */}
                <div className="space-y-6">
                  {[
                    {
                      problem: "Performance Optimization",
                      solution:
                        "Implemented code splitting, lazy loading, and image optimization techniques",
                      tech: "React.lazy, Webpack, Image compression",
                      result:
                        "Improved loading speed by 70% and Core Web Vitals scores",
                    },
                    {
                      problem: "Cross-browser Compatibility",
                      solution:
                        "Used progressive enhancement and thorough testing across all major browsers",
                      tech: "Babel, Autoprefixer, BrowserStack",
                      result:
                        "Achieved 100% compatibility across Chrome, Firefox, Safari, and Edge",
                    },
                    {
                      problem: "Mobile Responsiveness",
                      solution:
                        "Implemented mobile-first design with Tailwind CSS breakpoints",
                      tech: "Tailwind CSS, Flexbox, Grid",
                      result:
                        "Perfect responsiveness across all device sizes from mobile to desktop",
                    },
                  ].map((defaultChallenge, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4
                            className="font-bold text-lg mb-2"
                            style={{ color: colors.dark }}
                          >
                            {defaultChallenge.problem}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {defaultChallenge.solution}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-blue-600">
                              Technologies: {defaultChallenge.tech}
                            </span>
                            <span className="font-medium text-green-600">
                              Result: {defaultChallenge.result}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Challenges Section - Always show this */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-12">
            <h3
              className="text-2xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Additional Technical Considerations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3" style={{ color: colors.dark }}>
                  Performance Optimizations
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-600">
                      Code splitting and lazy loading implementation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-600">
                      Image optimization and compression
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-600">
                      Database indexing and query optimization
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3" style={{ color: colors.dark }}>
                  Security Measures
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-600">
                      JWT authentication and authorization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-600">
                      Input validation and sanitization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-600">
                      Regular security audits and updates
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BUSINESS IMPACT ========== */}
      <section
        id="impact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Business Impact & Results
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-8" />
            <p className="text-gray-300 max-w-3xl mx-auto">
              Delivering measurable value and return on investment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="mb-4 text-green-400">
                <TrendingUpIcon className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Revenue Growth
              </h3>
              <p className="text-gray-300 mb-4">
                {enhancedProject.impact.revenue ||
                  "Significant increase in conversion rates and average order value through improved user experience"}
              </p>
              <div className="text-3xl font-bold text-green-400">+42%</div>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="mb-4 text-blue-400">
                <SpeedIcon className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Efficiency Gains
              </h3>
              <p className="text-gray-300 mb-4">
                {enhancedProject.impact.efficiency ||
                  "Streamlined operations reducing manual work and processing errors"}
              </p>
              <div className="text-3xl font-bold text-blue-400">-65%</div>
            </div>

            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="mb-4 text-purple-400">
                <ScalabilityIcon className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Scalability
              </h3>
              <p className="text-gray-300 mb-4">
                {enhancedProject.impact.growth ||
                  "Architecture supporting exponential user growth without performance degradation"}
              </p>
              <div className="text-3xl font-bold text-purple-400">5x</div>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-white">
              Key Performance Indicators
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">&lt;100ms</div>
                <div className="text-sm text-gray-300">API Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.8/5</div>
                <div className="text-sm text-gray-300">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT SOFTET SOLUTION ========== */}
      <section id="about" ref={aboutUsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="md:flex">
              <div className="md:w-2/5 p-12 text-white bg-gradient-to-br from-blue-900 to-indigo-900">
                <h2 className="text-3xl font-bold mb-6">
                  About Softet Solution
                </h2>
                <p className="mb-8 text-blue-200">
                  We transform complex business challenges into elegant,
                  scalable digital solutions that drive growth and efficiency.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <VerifiedIcon className="text-green-300" />
                    <span>10+ years industry experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VerifiedIcon className="text-green-300" />
                    <span>50+ successful projects delivered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VerifiedIcon className="text-green-300" />
                    <span>Expertise in modern web technologies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VerifiedIcon className="text-green-300" />
                    <span>Client satisfaction guarantee</span>
                  </div>
                </div>
              </div>

              <div className="md:w-3/5 p-12 bg-white">
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.dark }}
                >
                  Our Expertise
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    "Web Development",
                    "Mobile Applications",
                    "Desktop Software",
                    "E-commerce Solutions",
                    "API Development",
                    "Cloud Architecture",
                    "UI/UX Design",
                    "DevOps & Deployment",
                  ].map((expertise, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-gray-700">{expertise}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.dark }}
                  >
                    Our Development Process
                  </h4>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {["Discovery", "Design", "Development", "Deployment"].map(
                      (step, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold bg-blue-600">
                            {idx + 1}
                          </div>
                          <div className="text-sm font-medium">{step}</div>
                          {idx < 3 && (
                            <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-300" />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <section id="contact" ref={contactRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
            <RocketLaunchIcon className="text-5xl text-blue-600 mb-6 mx-auto" />
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Ready to Build Your Next Project?
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
              Let's discuss how Softet Solution can transform your vision into a
              high-performance digital product that delivers real business
              value.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection(contactRef)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Your Project
              </button>

              <a
                href="/#projects"
                className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300"
              >
                View More Projects
              </a>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
              Response within 24 hours • Free initial consultation • No
              obligation quote
            </p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <div>
        <Footer
          scrollToSection={scrollToSection}
          heroRef={heroRef}
          servicesRef={servicesRef}
          testimonialsRef={testimonialsRef}
          contactRef={contactRef}
          toolsRef={toolsRef}
          aboutUsRef={aboutUsRef}
        />
      </div>
    </main>
  );
}

export default ProjectDetails;