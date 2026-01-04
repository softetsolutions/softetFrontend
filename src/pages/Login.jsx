import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      const user = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.number || "",
        firstInstallmentPaid: data.user.firstInstallmentPaid,

        course: data.user.course || "Not Selected",
      };
      // console.log("Logged in user:", user);
      // console.log(user._id);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/industrial-training";
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
          {/* Left Text Section */}
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
            <p className="text-blue-100">
              Login to access your dashboard, assignments, and project
              resources.
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleLogin}
              className="rounded-2xl shadow-lg border border-blue-200 bg-white"
            >
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold text-center text-blue-800">
                  Login
                </h3>

                {/* Error Message */}
                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-white text-blue-800 placeholder-gray-400 px-3 py-2 outline-none
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-300 bg-white text-blue-800 placeholder-gray-400 px-3 py-2 outline-none
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm text-blue-800">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-blue-500" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-blue-800 underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-800 text-white font-semibold py-2 hover:bg-blue-700 transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Signup Link */}
                <p className="text-center text-sm text-blue-800">
                  Don’t have an account?{" "}
                  <a
                    href="/industrial-training/signup"
                    className="text-blue-600 font-semibold underline-offset-2 hover:underline"
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
