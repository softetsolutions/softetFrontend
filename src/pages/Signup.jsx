import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Signup() {
  return (
    <>
      <Navbar showoptions={false} />
      
      <div className="min-h-screen bg-blue-700 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8">
         
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

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl shadow-lg border border-blue-200 bg-white">
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold text-center text-blue-700">
                  Create Account
                </h3>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["First Name", "Last Name"].map((label, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder={label === "First Name" ? "John" : "Doe"}
                        className="w-full rounded-xl border border-gray-300 bg-white text-blue-800 placeholder-gray-400 px-3 py-2 outline-none
                          hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                  ))}
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-white text-blue-800 placeholder-gray-400 px-3 py-2 outline-none
                      hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-gray-300 bg-white text-blue-800 placeholder-gray-400 px-3 py-2 outline-none
                      hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

               
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-gray-300 bg-white text-blue-800 placeholder-gray-400 px-3 py-2 outline-none
                      hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                
                <div className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1 accent-blue-500" />
                  <span>
                    I agree to the{" "}
                    <span className="text-blue-700 font-medium">
                      Terms & Conditions
                    </span>
                  </span>
                </div>

                
                <button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition">
                  Sign Up
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
