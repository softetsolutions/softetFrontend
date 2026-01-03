import Navbar from "../components/Navbar";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

export default function IndustrialTraining() {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <Navbar showoptions={false} />

      <main className="bg-slate-50 text-gray-900">
        {/* HERO */}
        <section className="bg-gradient-to-b from-blue-600 to-blue-500 py-24 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            🚀 Industrial Training Program
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-100 mb-6">
            By Softet Solutions
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-blue-50">
            Industry-focused, hands-on MERN Stack training designed to make you
            job-ready. Learn directly from working software developers.
          </p>

          <Link className="inline-block mt-10 bg-white text-blue-600 px-10 py-3 rounded-xl font-semibold shadow hover:bg-blue-50 transition">
            Apply Now(Coming Soon..)
          </Link>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-14 text-gray-800">
            What You Will Get
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature title="Complete MERN Stack (Live)">
              Learn MongoDB, Express, React, and Node.js from basics to advanced
              with real-world best practices.
            </Feature>

            <Feature title="Industry-Level Capstone Project">
              Build a real-use-case project that strengthens your portfolio.
            </Feature>

            <Feature title="Recorded Lectures">
              Access all live class recordings anytime from our learning portal.
            </Feature>

            <Feature title="Official Completion Letter">
              Receive an official training / appointment letter from Softet
              Solutions.
            </Feature>

            <Feature title="Weekend Doubt Sessions">
              Dedicated Saturday & Sunday doubt-solving sessions.
            </Feature>

            <Feature title="Hands-on Assignments">
              Practice with real industry-style assignments and tasks.
            </Feature>

            <Feature title="Industry-Oriented Guidance">
              Learn coding standards, project structure, Git & workflows.
            </Feature>

            <Feature title="Career & Interview Guidance">
              Resume tips, project presentation & interview preparation.
            </Feature>
          </div>
        </section>

        {/* WHY US */}
        <section className="bg-white py-20 px-6 border-t">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Why Softet Solutions?
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              We work with clients across <strong>Australia</strong> and{" "}
              <strong>England</strong>, delivering production-grade software
              solutions.
            </p>
            <p className="text-lg text-gray-600">
              You don’t learn from traditional teachers — you learn from{" "}
              <strong>real software developers</strong> actively working on
              real-world projects.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="apply"
          className="max-w-4xl mx-auto py-20 px-6 text-center"
        >
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Program Fees
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-12 border">
            <p className="text-5xl font-extrabold text-blue-600 mb-2">₹4,999</p>
            <p className="text-gray-500 mb-8">
              One-time fee • Industry-grade training
            </p>

            <Link className="inline-block bg-blue-600 text-white px-12 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Enroll Now(Coming Soon...)
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-10 px-6 text-center">
          <p className="font-semibold text-white">Softet Solutions</p>
          <p className="mt-1">GSTIN: 09CFYPT0083D1ZX</p>
          <p className="mt-3">
            <a
              href="https://www.softetsolutions.com"
              className="text-blue-400 hover:underline"
            >
              Website
            </a>{" "}
            |{" "}
            <a
              href="https://in.linkedin.com/company/softet-solutions"
              className="text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
          </p>
          <p className="mt-3 text-sm">
            © 2025 Softet Solutions. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}

function Feature({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );
}
