import { useState } from "react";
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { forgotPassword } from "../reportet/api/employee";

export default function ForgotPassword() {
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    const trimmed = userName.trim();
    if (!trimmed) {
      setErrorMsg("Enter your username to continue.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await forgotPassword({ userName: trimmed });
      setStatus("success");
      setSuccessMsg(data.message);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-5">
          <Lock className="w-7 h-7 text-blue-600" strokeWidth={1.75} />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1.5 text-center">
          Forgot password?
        </h1>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-7">
          Enter your username and we'll send a reset link to your registered
          email address.
        </p>

        {status === "success" ? (
          <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 items-start mb-6">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 leading-relaxed">
              {successMsg}
            </p>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-1.5 mb-5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-gray-600 uppercase tracking-wide"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="e.g. ORG001_EMP42"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setErrorMsg("");
                  }
                }}
                onKeyDown={handleKeyDown}
                disabled={status === "loading"}
                autoFocus
                autoComplete="username"
                className={`w-full h-10 rounded-lg border text-sm px-3 text-gray-900 placeholder-gray-400 bg-gray-50 outline-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                  status === "error"
                    ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
                    : "border-gray-300"
                }`}
              />
              {status === "error" && errorMsg && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-6"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending link…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </>
        )}

        <a
          href="/login"
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </a>
      </div>
    </div>
  );
}
