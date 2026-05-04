import { useState, useEffect, useRef } from "react";

/*
  THEME — softetsolutions.com
  Primary  : #2563EB
  BG       : #F8FAFF
  Surface  : #FFFFFF
  Dark     : #0F172A
  Danger   : #EF4444
  Success  : #16A34A
  Muted    : #64748B
*/

const SEATS_TOTAL = 10;
const SEATS_TAKEN = 5;
const SEATS_LEFT = SEATS_TOTAL - SEATS_TAKEN;
const PRICE = 110000;
const pad = (n) => String(n).padStart(2, "0");

/* ── Countdown ── */
function useCountdown() {
  const [time, setTime] = useState({ h: 115, m: 41, s: 17 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((p) => {
        const { h, m, s } = p;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── Sticky enroll bar ── */
function StickyBar({ onEnroll }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#0F172A",
        borderTop: "3px solid #2563EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        gap: 12,
        flexWrap: "wrap",
        boxShadow: "0 -4px 30px rgba(37,99,235,0.25)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>
          🚀 Founding Batch — Full Stack + AI Product Development
        </p>
        <p style={{ color: "#94A3B8", fontSize: 13, margin: 0 }}>
          ₹{PRICE.toLocaleString()} · 1-Year Program · Only {SEATS_LEFT} Seats
          Left
        </p>
      </div>
      <button
        onClick={onEnroll}
        disabled={true}
        style={{
          background: "#2563EB",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 28px",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: "0 0 20px rgba(37,99,235,0.5)",
        }}
      >
        Enroll Now → (Coming Soon)
      </button>
    </div>
  );
}

/* ── FAQ accordion ── */
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        marginBottom: 10,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "16px 20px",
          background: open ? "#EFF6FF" : "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <span style={{ fontWeight: 600, color: "#0F172A", fontSize: 15 }}>
          {q}
        </span>
        <span
          style={{
            color: "#2563EB",
            fontSize: 22,
            lineHeight: 1,
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform .2s",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 20px 16px",
            color: "#475569",
            fontSize: 14,
            lineHeight: 1.7,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

/* ── Curriculum ── */
const CURRICULUM = [
  {
    label: "Month 1–2",
    title: "Web Foundations",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    items: [
      "HTML5, CSS3 — pixel-perfect, responsive layouts from scratch",
      "JavaScript ES6+ — closures, async/await, DOM APIs",
      "Git & GitHub — real branching, PRs and code review workflows",
      "Tailwind CSS — build professional UIs fast",
      "🏗 Project: Developer portfolio + 3 real-world clone projects",
    ],
  },
  {
    label: "Month 3–4",
    title: "MERN Stack",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    items: [
      "React 19 — hooks, context, performance patterns",
      "Node.js + Express — REST APIs, JWT authentication, middleware",
      "MongoDB + Mongoose — schema design, aggregation pipelines",
      "API testing with Postman, error handling best practices",
      "🏗 Project: Full e-commerce app — cart, payments, auth flow",
    ],
  },
  {
    label: "Month 5",
    title: "Next.js + React Native",
    bg: "#FFF7ED",
    border: "#FED7AA",
    items: [
      "Next.js 15 App Router — SSR, SSG, ISR, server actions",
      "React Native + Expo — build iOS & Android from one codebase",
      "Zustand + React Query — modern, scalable state management",
      "Push notifications, camera, location APIs in mobile",
      "🏗 Project: SaaS web app + cross-platform mobile companion",
    ],
  },
  {
    label: "Month 6",
    title: "Cloud & DevOps",
    bg: "#FEF9C3",
    border: "#FDE047",
    items: [
      "AWS — EC2, S3, RDS, Lambda, CloudFront",
      "Docker & Docker Compose — containerise everything",
      "CI/CD pipelines with GitHub Actions",
      "Vercel & Netlify — production deployments with zero downtime",
      "🏗 Project: Deploy & scale your capstone to live production",
    ],
  },
  {
    label: "Month 7–12",
    title: "AI Billing Product — Live Build",
    bg: "#F5F3FF",
    border: "#C4B5FD",
    isHighlight: true,
    items: [
      "Join the founding team building Softet's real AI billing product",
      "Participate from requirements → architecture → development → deployment",
      "Work on a product that real businesses will use — not a dummy project",
      "Experience sprints, standups, PR reviews like a real engineering team",
      "Your code, your features, your name in the product's history",
    ],
  },
];

const FAQS = [
  {
    q: "This is the first batch — how can I trust the program quality?",
    a: "Great question, and we appreciate you asking directly. Because this is our founding batch, you're getting maximum attention — small group of 10, direct access to mentors, and we're personally invested in every student's outcome. We're building our reputation with you.",
  },
  {
    q: "What exactly is the AI billing software I'll be building?",
    a: "It's Softet's own flagship product — an AI-native billing and invoicing suite for Indian businesses. You'll work on it from the very beginning: product requirements, architecture decisions, UI/UX, backend APIs, AI integrations, and cloud deployment. This is a real product that will be used by real customers.",
  },
  {
    q: "Will I get credit for what I build on the product?",
    a: "Yes. You'll be acknowledged as a founding contributor. The code you write goes into a real, live product. That's something you can point to in any interview — an actual product with real users, not a college project.",
  },
  {
    q: "What's the class schedule like?",
    a: "Live sessions run on weekday evenings (7–9 PM IST) and Saturday mornings so your college timetable isn't affected. All classes are recorded and accessible on-demand forever.",
  },
  {
    q: "Do I need prior coding knowledge to join?",
    a: "You need basic programming familiarity — any language. We start from HTML and web fundamentals and ramp up methodically. If you've done even one semester of programming at college, you're ready.",
  },
  {
    q: "Is EMI available?",
    a: "Yes. You can pay in 3 or 6 equal instalments. Details are shared on the application call. No hidden charges or interest.",
  },
];

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function FullStackCoursePage() {
  const { h, m, s } = useCountdown();
  const [activeTab, setActiveTab] = useState(0);
  const enrollRef = useRef(null);
  const scrollToEnroll = () =>
    enrollRef.current?.scrollIntoView({ behavior: "smooth" });

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    .fsc * { box-sizing: border-box; margin: 0; padding: 0; }
    .fsc { font-family: 'Plus Jakarta Sans', sans-serif; color: #0F172A; background: #F8FAFF; }
    .fsc-btn {
      display: inline-block; background: #2563EB; color: #fff;
      border: none; border-radius: 10px; padding: 16px 36px;
      font-weight: 800; font-size: 16px; cursor: pointer;
      transition: background .2s, transform .15s, box-shadow .2s;
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-shadow: 0 4px 18px rgba(37,99,235,0.35);
    }
    .fsc-btn:hover { background: #1D4ED8; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.5); }
    .fsc-btn-ghost {
      display: inline-block; background: transparent; color: #fff;
      border: 2px solid rgba(255,255,255,0.55); border-radius: 10px; padding: 14px 30px;
      font-weight: 700; font-size: 15px; cursor: pointer;
      transition: all .2s; font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .fsc-btn-ghost:hover { background: rgba(255,255,255,0.12); border-color: #fff; }
    .fsc-card {
      background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 28px;
      transition: box-shadow .25s, transform .25s;
    }
    .fsc-card:hover { box-shadow: 0 8px 32px rgba(37,99,235,0.1); transform: translateY(-3px); }
    .fsc-badge {
      display: inline-block; background: #EFF6FF; color: #2563EB;
      border: 1px solid #BFDBFE; border-radius: 99px;
      padding: 4px 16px; font-size: 13px; font-weight: 700;
    }
    .fsc-tab {
      padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
      font-weight: 600; font-size: 14px; transition: all .2s; white-space: nowrap;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .fsc-hero {
      background: linear-gradient(135deg, #1E40AF 0%, #2563EB 55%, #3B82F6 100%);
      position: relative; overflow: hidden;
    }
    .fsc-hero::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(circle at 75% 40%, rgba(255,255,255,0.06) 0%, transparent 55%);
    }
    .fsc-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .fsc-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .fsc-divider { height: 1px; background: #E2E8F0; }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #EF4444; display: inline-block; animation: pulse-dot 1.2s infinite; flex-shrink: 0; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .float { animation: float 3.5s ease-in-out infinite; }
    @keyframes shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .ai-card-glow {
      background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
      border: 1px solid #6366F1;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
    }
    .ai-card-glow::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 60% 40%, rgba(99,102,241,0.15) 0%, transparent 60%);
      pointer-events: none;
    }
    @media (max-width: 600px) {
      .hero-ctas { flex-direction: column !important; }
      .hero-ctas button { width: 100%; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="fsc">
        <StickyBar onEnroll={scrollToEnroll} />

        {/* ── ALERT BAR ── */}
        <div
          style={{
            background: "#1E40AF",
            color: "#fff",
            textAlign: "center",
            padding: "9px 20px",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <span className="dot" />
          🚀 Founding Batch — Only {SEATS_LEFT} of {SEATS_TOTAL} seats remaining
          · Closes in&nbsp;
          <strong
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 4,
              padding: "1px 8px",
            }}
          >
            {pad(h)}:{pad(m)}:{pad(s)}
          </strong>
        </div>

        {/* ── HERO ── */}
        <section className="fsc-hero" style={{ padding: "80px 20px 72px" }}>
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span
              className="float"
              style={{ fontSize: 52, display: "block", marginBottom: 16 }}
            >
              🚀
            </span>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 22,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 99,
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                By Softet Solutions
              </span>
              <span
                style={{
                  background: "rgba(99,102,241,0.8)",
                  color: "#fff",
                  borderRadius: 99,
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                ✦ Founding Batch 2025
              </span>
            </div>

            <h1
              style={{
                color: "#fff",
                fontWeight: 900,
                lineHeight: 1.1,
                fontSize: "clamp(2rem,5vw,3.6rem)",
                marginBottom: 20,
              }}
            >
              Become a Full-Stack Developer.
              <br />
              <span style={{ color: "#FDE68A" }}>Build a Real Product.</span>
              <br />
              <span
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "clamp(1.2rem,2.5vw,1.9rem)",
                  fontWeight: 700,
                }}
              >
                From Day One.
              </span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "clamp(15px,2vw,18px)",
                lineHeight: 1.75,
                maxWidth: 630,
                margin: "0 auto 32px",
              }}
            >
              A 1-year program for 3rd-year Engineering, BCA & MCA students.
              <strong style={{ color: "#FDE68A" }}>
                {" "}
                6 months of training + 6 months building Softet's AI-native
                billing product
              </strong>{" "}
              — a real product, with real users, shipping to production.
            </p>

            {/* seat bar */}
            <div style={{ maxWidth: 440, margin: "0 auto 32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <span>
                  🔥 {SEATS_TAKEN}/{SEATS_TOTAL} seats filled
                </span>
                <span style={{ color: "#FDE68A", fontWeight: 700 }}>
                  Only {SEATS_LEFT} left
                </span>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 99,
                  height: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(SEATS_TAKEN / SEATS_TOTAL) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#FDE68A,#F59E0B)",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>

            <div
              className="hero-ctas"
              style={{ display: "flex", gap: 12, justifyContent: "center" }}
            >
              <button
                className="fsc-btn"
                onClick={scrollToEnroll}
                style={{
                  background: "#fff",
                  color: "#2563EB",
                  fontSize: 16,
                  padding: "16px 44px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                🎯 Apply for Founding Batch
              </button>
              <button
                className="fsc-btn-ghost"
                onClick={() =>
                  document
                    .getElementById("curriculum")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See What You'll Build ↓
              </button>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
                marginTop: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ✅ No hidden fees &nbsp;|&nbsp; ✅ EMI available &nbsp;|&nbsp; ✅
              Pan India · 100% Online
            </p>
          </div>
        </section>

        {/* ── WHO IS THIS FOR ── */}
        <section style={{ padding: "70px 24px", background: "#F8FAFF" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <span
                className="fsc-badge"
                style={{ marginBottom: 12, display: "inline-block" }}
              >
                Is This For You?
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.6rem,3vw,2.4rem)",
                  fontWeight: 900,
                }}
              >
                This Program Is Built For You If…
              </h2>
            </div>
            <div className="fsc-grid-2">
              {[
                {
                  icon: "🎓",
                  t: "You're in 3rd Year (Engg / BCA / MCA)",
                  d: "Placement season is roughly 12 months away — exactly the length of this program. The timing is deliberate.",
                },
                {
                  icon: "💻",
                  t: "You Know Some Coding But Can't Build Apps",
                  d: "College taught you syntax. We teach you how to ship. Real apps, real codebases, real decisions.",
                },
                {
                  icon: "🤔",
                  t: "You Want More Than Just Another Course",
                  d: "You want to build something that actually exists in the world — something you can point at and say 'I made that.'",
                },
                {
                  icon: "📍",
                  t: "You're Anywhere in India",
                  d: "100% online, live evening sessions. Study from Lucknow, Jaipur, Patna, Chennai — location is irrelevant.",
                },
                {
                  icon: "🏗",
                  t: "You Want Real Product Experience",
                  d: "Instead of a fake capstone, you'll work on Softet's own AI billing product — from idea to production deployment.",
                },
                {
                  icon: "⏰",
                  t: "You Can Give 2–3 Hours a Day",
                  d: "Classes run evenings and Saturday mornings. Designed to fit around your existing college schedule.",
                },
              ].map(({ icon, t, d }) => (
                <div
                  key={t}
                  className="fsc-card"
                  style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: "#0F172A",
                        marginBottom: 6,
                      }}
                    >
                      {t}
                    </h3>
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: 14,
                        lineHeight: 1.65,
                      }}
                    >
                      {d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI PRODUCT SECTION ── */}
        <section style={{ padding: "70px 24px", background: "#0F172A" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(99,102,241,0.2)",
                  color: "#A5B4FC",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: 99,
                  padding: "4px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 14,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                ✦ The Big Thing
              </span>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "clamp(1.7rem,3.5vw,2.6rem)",
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}
              >
                You Won't Build a Practice Project.
                <br />
                <span style={{ color: "#A5B4FC" }}>
                  You'll Ship a Real Product.
                </span>
              </h2>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: 16,
                  maxWidth: 580,
                  margin: "0 auto",
                  lineHeight: 1.75,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                In months 7–12, you join the founding team building Softet's
                flagship product — an AI-native billing & invoicing suite for
                Indian businesses.
              </p>
            </div>

            {/* product card */}
            <div
              className="ai-card-glow"
              style={{ padding: "44px 40px", marginBottom: 32 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ fontSize: 52, lineHeight: 1, flexShrink: 0 }}>
                  🧾
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 22,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      AI-Native Billing Software Suite
                    </h3>
                    <span
                      style={{
                        background: "#6366F1",
                        color: "#fff",
                        borderRadius: 6,
                        padding: "2px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      SOFTET FLAGSHIP
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#C7D2FE",
                      fontSize: 15,
                      lineHeight: 1.75,
                      marginBottom: 22,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    A full billing and invoicing platform for Indian SMBs — with
                    AI that automates invoice generation, payment reminders, GST
                    handling, and financial summaries. Built with the MERN
                    stack, deployed on AWS, designed for thousands of real
                    users.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {[
                      {
                        icon: "📋",
                        label: "Requirements",
                        desc: "You sit in on actual product planning",
                      },
                      {
                        icon: "🏛",
                        label: "Architecture",
                        desc: "Design decisions that affect real users",
                      },
                      {
                        icon: "⚙️",
                        label: "Development",
                        desc: "Write code that goes into production",
                      },
                      {
                        icon: "🚀",
                        label: "Deployment",
                        desc: "Ship it live on AWS — end to end",
                      },
                    ].map(({ icon, label, desc }) => (
                      <div
                        key={label}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                          padding: "16px 18px",
                        }}
                      >
                        <p style={{ fontSize: 22, marginBottom: 6 }}>{icon}</p>
                        <p
                          style={{
                            color: "#E0E7FF",
                            fontWeight: 800,
                            fontSize: 14,
                            marginBottom: 4,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            color: "#94A3B8",
                            fontSize: 13,
                            lineHeight: 1.5,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* what this means */}
            <div className="fsc-grid-3" style={{ gap: 16 }}>
              {[
                {
                  icon: "🧑‍💻",
                  title: "You're a Contributor, Not a Student",
                  body: "Your code will be used by real businesses. That's not a portfolio project — that's work experience.",
                },
                {
                  icon: "📣",
                  title: "Something Real to Talk About in Interviews",
                  body: '"I built and deployed a feature on a live SaaS product used by X businesses" beats any college project.',
                },
                {
                  icon: "🌱",
                  title: "Be Part of Something From the Start",
                  body: "You're joining Softet's product journey from day zero. Founding contributors get credited in the product.",
                },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "24px 22px",
                  }}
                >
                  <span
                    style={{ fontSize: 28, display: "block", marginBottom: 12 }}
                  >
                    {icon}
                  </span>
                  <h4
                    style={{
                      color: "#E0E7FF",
                      fontWeight: 800,
                      fontSize: 15,
                      marginBottom: 8,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {title}
                  </h4>
                  <p
                    style={{
                      color: "#64748B",
                      fontSize: 14,
                      lineHeight: 1.65,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CURRICULUM ── */}
        <section
          style={{ padding: "70px 24px", background: "#fff" }}
          id="curriculum"
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <span
                className="fsc-badge"
                style={{ marginBottom: 12, display: "inline-block" }}
              >
                Full Curriculum
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.6rem,3vw,2.4rem)",
                  fontWeight: 900,
                }}
              >
                12 Months. Every Skill. Real Outcome.
              </h2>
              <p
                style={{
                  color: "#64748B",
                  marginTop: 10,
                  maxWidth: 520,
                  margin: "10px auto 0",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Structured, mentor-guided — from web fundamentals all the way to
                shipping a live AI product.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 6,
                marginBottom: 24,
                scrollbarWidth: "none",
              }}
            >
              {CURRICULUM.map((tab, i) => (
                <button
                  key={i}
                  className="fsc-tab"
                  onClick={() => setActiveTab(i)}
                  style={{
                    background:
                      activeTab === i
                        ? tab.isHighlight
                          ? "#6366F1"
                          : "#2563EB"
                        : "#F1F5F9",
                    color: activeTab === i ? "#fff" : "#475569",
                    boxShadow:
                      activeTab === i
                        ? tab.isHighlight
                          ? "0 4px 14px rgba(99,102,241,0.4)"
                          : "0 4px 14px rgba(37,99,235,0.3)"
                        : "none",
                    border:
                      tab.isHighlight && activeTab !== i
                        ? "1px solid #C4B5FD"
                        : "none",
                  }}
                >
                  {tab.label} {tab.isHighlight ? "✦" : ""}
                </button>
              ))}
            </div>

            <div
              style={{
                background: CURRICULUM[activeTab].bg,
                border: `1px solid ${CURRICULUM[activeTab].border}`,
                borderRadius: 16,
                padding: "32px 36px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 22,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: CURRICULUM[activeTab].isHighlight
                      ? "#6366F1"
                      : "#2563EB",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "3px 14px",
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {CURRICULUM[activeTab].label}
                </span>
                <h3 style={{ fontWeight: 900, fontSize: 20, color: "#0F172A" }}>
                  {CURRICULUM[activeTab].title}
                </h3>
                {CURRICULUM[activeTab].isHighlight && (
                  <span
                    style={{
                      background: "#EDE9FE",
                      color: "#6D28D9",
                      border: "1px solid #DDD6FE",
                      borderRadius: 99,
                      padding: "2px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    AI Product Build
                  </span>
                )}
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {CURRICULUM[activeTab].items.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: CURRICULUM[activeTab].isHighlight
                          ? "#6366F1"
                          : "#2563EB",
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        color: "#1E293B",
                        fontSize: 15,
                        lineHeight: 1.65,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section style={{ padding: "60px 24px", background: "#F8FAFF" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <span
              className="fsc-badge"
              style={{ marginBottom: 12, display: "inline-block" }}
            >
              Tech Stack
            </span>
            <h2
              style={{
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              Every Layer. Front-End to Cloud.
            </h2>
            <p
              style={{
                color: "#64748B",
                marginBottom: 32,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              You'll be comfortable across the full stack — web, mobile, backend
              and cloud.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {[
                { name: "React 19", color: "#0891B2", bg: "#E0F7FA" },
                { name: "Node.js", color: "#15803D", bg: "#DCFCE7" },
                { name: "MongoDB", color: "#15803D", bg: "#DCFCE7" },
                { name: "Express.js", color: "#374151", bg: "#F3F4F6" },
                { name: "Next.js 15", color: "#111827", bg: "#F3F4F6" },
                { name: "React Native", color: "#0891B2", bg: "#E0F7FA" },
                { name: "TypeScript", color: "#1D4ED8", bg: "#DBEAFE" },
                { name: "AWS", color: "#B45309", bg: "#FEF3C7" },
                { name: "Docker", color: "#1D4ED8", bg: "#DBEAFE" },
                { name: "Tailwind CSS", color: "#0E7490", bg: "#CFFAFE" },
                { name: "Vercel", color: "#111827", bg: "#F3F4F6" },
                { name: "GitHub Actions", color: "#1D4ED8", bg: "#DBEAFE" },
                { name: "OpenAI API", color: "#6D28D9", bg: "#EDE9FE" },
                { name: "LangChain", color: "#6D28D9", bg: "#EDE9FE" },
              ].map(({ name, color, bg }) => (
                <div
                  key={name}
                  style={{
                    background: bg,
                    color,
                    border: `1px solid ${color}25`,
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES THIS DIFFERENT ── */}
        <section style={{ padding: "70px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <span
                className="fsc-badge"
                style={{ marginBottom: 12, display: "inline-block" }}
              >
                Why This Program
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.6rem,3vw,2.4rem)",
                  fontWeight: 900,
                }}
              >
                What Makes This Different From Every Other Course
              </h2>
            </div>
            <div className="fsc-grid-3">
              {[
                {
                  icon: "🏭",
                  t: "You Work on a Real Product",
                  d: "Not a dummy app. Not a tutorial clone. Softet's AI billing product will have real business customers. You'll be part of building it.",
                },
                {
                  icon: "👨‍🏫",
                  t: "Mentors Who Build For a Living",
                  d: "Taught by working software developers at Softet Solutions — people who write production code every day, not just instructors.",
                },
                {
                  icon: "📱",
                  t: "Web + Mobile + Cloud",
                  d: "Most courses stop at React. You'll cover Next.js, React Native, AWS, and Docker — making you relevant for far more roles.",
                },
                {
                  icon: "🤖",
                  t: "AI-First Thinking",
                  d: "You'll integrate OpenAI APIs and work with LangChain as part of the product build. AI is baked in, not an afterthought.",
                },
                {
                  icon: "🧑‍🤝‍🧑",
                  t: "Small Cohort — 10 Students Only",
                  d: "You're not a ticket number. With only 10 seats, every student gets genuine attention, feedback and support.",
                },
                {
                  icon: "📐",
                  t: "From Requirements to Deployment",
                  d: "You'll experience every stage of a real software product — planning, design, build, test, ship. A complete picture of how software actually works.",
                },
              ].map(({ icon, t, d }) => (
                <div
                  key={t}
                  className="fsc-card"
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      margin: "0 auto 16px",
                    }}
                  >
                    {icon}
                  </div>
                  <h3
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: "#0F172A",
                      marginBottom: 8,
                    }}
                  >
                    {t}
                  </h3>
                  <p
                    style={{ color: "#64748B", fontSize: 14, lineHeight: 1.65 }}
                  >
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOUNDING BATCH CALLOUT ── */}
        <section style={{ padding: "60px 24px", background: "#EFF6FF" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div
              style={{
                background: "#fff",
                border: "2px solid #BFDBFE",
                borderRadius: 20,
                padding: "40px 36px",
                textAlign: "center",
              }}
            >
              <span
                style={{ fontSize: 40, display: "block", marginBottom: 16 }}
              >
                🌱
              </span>
              <h3
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(1.4rem,2.5vw,2rem)",
                  color: "#0F172A",
                  marginBottom: 14,
                }}
              >
                This Is Our First Batch.
                <br />
                <span style={{ color: "#2563EB" }}>
                  That's Exactly Why You Should Join.
                </span>
              </h3>
              <p
                style={{
                  color: "#475569",
                  fontSize: 15,
                  lineHeight: 1.8,
                  maxWidth: 580,
                  margin: "0 auto 24px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                We're not a platform with thousands of anonymous students. We're
                10 people and a small team building something together. You'll
                have direct access to mentors, influence over how the program
                runs, and your name attached to the very first version of a
                product we intend to grow.
                <strong style={{ color: "#0F172A" }}>
                  {" "}
                  Founding members always have a different story to tell.
                </strong>
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { icon: "🔟", label: "Max 10 students" },
                  { icon: "🎙", label: "Direct mentor access" },
                  { icon: "🏷", label: "Founding contributor credit" },
                  { icon: "📦", label: "Real product, real users" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      borderRadius: 10,
                      padding: "8px 16px",
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1D4ED8",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section
          ref={enrollRef}
          style={{ padding: "70px 24px", background: "#F8FAFF" }}
        >
          <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
            <span
              className="fsc-badge"
              style={{ marginBottom: 12, display: "inline-block" }}
            >
              Pricing
            </span>
            <h2
              style={{
                fontSize: "clamp(1.6rem,3vw,2.4rem)",
                fontWeight: 900,
                marginBottom: 36,
              }}
            >
              One Investment. A Career's Worth of Experience.
            </h2>
            <div
              className="fsc-card"
              style={{
                padding: "44px 36px",
                borderColor: "#2563EB",
                borderWidth: 2,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#2563EB",
                  color: "#fff",
                  borderRadius: 99,
                  padding: "5px 20px",
                  fontSize: 13,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                🚀 FOUNDING BATCH — {SEATS_LEFT} SEATS ONLY
              </div>

              <p
                style={{
                  fontSize: "clamp(2.8rem,7vw,4.5rem)",
                  fontWeight: 900,
                  color: "#2563EB",
                  lineHeight: 1,
                  marginBottom: 4,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                ₹{PRICE.toLocaleString()}
              </p>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 14,
                  marginBottom: 28,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                One-time · EMI available (3 or 6 months, zero cost)
              </p>

              <div style={{ textAlign: "left", marginBottom: 28 }}>
                {[
                  "6 months of live, structured full-stack training",
                  "6 months building Softet's real AI billing product",
                  "All recordings available on-demand, forever",
                  "Code review and 1:1 feedback from working developers",
                  "Resume & portfolio review session",
                  "Founding contributor credit in the product",
                  "Max 10 students — direct mentor attention",
                  "EMI option: 3 or 6 months",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      marginBottom: 11,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        color: "#2563EB",
                        fontSize: 16,
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        color: "#1E293B",
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="fsc-btn"
                style={{ width: "100%", fontSize: 17, padding: "18px 24px" }}
                onClick={() =>
                  window.open("https://forms.gle/aD5SyjraogBw24kD6")
                }
              >
                Fill the Google Form
              </button>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  marginTop: 10,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Seat confirmed after payment · Only {SEATS_LEFT} spots remaining
              </p>

              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  padding: "12px 18px",
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span className="dot" />
                <span
                  style={{
                    color: "#B91C1C",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Batch closes in: {pad(h)}h {pad(m)}m {pad(s)}s
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "70px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span
                className="fsc-badge"
                style={{ marginBottom: 12, display: "inline-block" }}
              >
                FAQ
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  fontWeight: 900,
                }}
              >
                Honest Answers to Real Questions
              </h2>
            </div>
            {FAQS.map((f) => (
              <FAQ key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="fsc-hero" style={{ padding: "72px 24px" }}>
          <div
            style={{
              maxWidth: 660,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "clamp(1.7rem,3.5vw,2.8rem)",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              10 Seats. One Founding Batch.
              <br />
              <span style={{ color: "#FDE68A" }}>
                Be Part of Building Something Real.
              </span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 16,
                lineHeight: 1.75,
                marginBottom: 32,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              A year from now, you could have a full-stack skillset, real
              product experience, and your name on a live AI application that
              businesses actually use. That story starts with one of these{" "}
              {SEATS_LEFT} remaining seats.
            </p>
            <button
              className="fsc-btn"
              onClick={scrollToEnroll}
              style={{
                background: "#fff",
                color: "#2563EB",
                fontSize: 17,
                padding: "18px 52px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              🚀 Apply Now — ₹1,10,000
            </button>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
                marginTop: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Questions? WhatsApp us:{" "}
              <strong style={{ color: "#fff" }}>+91 6387651169</strong>
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div
          style={{
            background: "#0F172A",
            color: "#475569",
            textAlign: "center",
            padding: "24px 20px",
            paddingBottom: 80,
            fontSize: 13,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          © {new Date().getFullYear()} Softet Solutions. · All rights reserved ·
          Pan India Online Program
        </div>
      </div>
    </>
  );
}
