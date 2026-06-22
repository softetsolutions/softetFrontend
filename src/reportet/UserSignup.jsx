import { useState } from "react";
import { signupUser } from "./api/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signupUser(form);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
      setForm({ organizationName: "", email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-gray-500"></div>

            <div className="p-8">
              {/* Back Button */}
              <Link
                to="/reportet"
                className="inline-flex items-center text-sm hover:text-blue-400 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>

              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create Organization Account</h1>
                <p className="text-black">Fill in your details to get started</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Name */}
                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={form.organizationName}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Your Organization"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="org@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full p-3 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-sm text-gray-400 text-center mb-4">
                  By registering, you agree to our{" "}
                  <Link
                    to="/terms-conditions"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-500 text-black font-medium rounded-lg hover:cursor-pointer hover:bg-blue-400 transition"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
