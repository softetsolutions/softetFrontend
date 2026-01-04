import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [course, setCourse] = useState("");

  const [searchParams] = useSearchParams();
  const refferedBy = searchParams.get("referredBy") || null;
  // console.log("Referred By:", refferedBy);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://207.180.250.79:5005/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          number: phone,
          password,
          referredBy: refferedBy,
          course,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
      } else {
        setSuccess(`${data.message}. You have enrolled for ${course} course.`);

        setTimeout(
          () => (window.location.href = "/industrial-training/login"),
          1500
        );
      }
    } catch (err) {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showoptions={false} />

      <div className="min-h-screen bg-blue-700 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <h1 className="text-4xl font-bold text-white mb-3">
              Softet Solution
            </h1>
            <h2 className="text-xl font-semibold text-white mb-2">
              Industrial Training Program
            </h2>
            <p className="text-blue-200">
              Sign up to enroll in the program and start your learning journey.
            </p>
          </motion.div>

          {/* Signup Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSignup}
              className="rounded-2xl shadow-lg border border-blue-200 bg-white p-8 space-y-6"
            >
              <h3 className="text-2xl font-semibold text-center text-blue-700">
                Create Account
              </h3>

              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Phone */}
              <input
                type="tel"
                placeholder="Phone"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Course Selection */}
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="" disabled>
                  Select Course
                </option>
                <option value="Java Full Stack">Java Full Stack</option>
                <option value="MERN">MERN</option>
              </select>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 accent-blue-500"
                  required
                />
                <span>
                  I agree to the{" "}
                  <span className="text-blue-700 font-medium">
                    Terms & Conditions
                  </span>
                </span>
              </div>

              {/* Error / Success */}
              {error && <p className="text-red-600 text-center">{error}</p>}
              {success && (
                <p className="text-green-600 text-center">{success}</p>
              )}
              {refferedBy && (
                <p className="text-sm text-green-700 text-center">
                  You are joining using referral code: <b>{refferedBy}</b>
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p className="text-center text-sm text-gray-700">
                Already have an account?{" "}
                <a
                  href="/industrial-training/login"
                  className="text-blue-700 font-medium hover:underline"
                >
                  Login
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
