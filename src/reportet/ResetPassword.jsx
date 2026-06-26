import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  LinkIcon,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { resetPassword as resetPasswordApi } from "../reportet/api/employee";

export default function ResetPassword() {
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    if (!newPassword || !confirmPassword) {
      setErrorMsg("Both fields are required.");
      return false;
    }
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!validate()) {
      setStatus("error");
      return;
    }
    if (!token) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      await resetPasswordApi(token, { newPassword, confirmPassword });
      setStatus("success");
    } catch (err) {
      if (err.expired) setStatus("invalid");
      else {
        setErrorMsg(err.message || "Something went wrong. Try again.");
        setStatus("error");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const clearError = () => {
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <LinkIcon className="w-7 h-7 text-red-500" strokeWidth={1.75} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1.5 text-center">
            Link expired
          </h1>
          <p className="text-sm text-gray-500 text-center leading-relaxed mb-7">
            This reset link is invalid or has expired. Reset links are valid for
            1 hour.
          </p>
          <a
            href="/forgot-password"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors mb-4"
          >
            Request a new link
          </a>
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

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
            <CheckCircle
              className="w-7 h-7 text-green-600"
              strokeWidth={1.75}
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1.5 text-center">
            Password updated
          </h1>
          <p className="text-sm text-gray-500 text-center leading-relaxed mb-7">
            Your password has been reset. You can now log in with your new
            password.
          </p>
          <a
            href="/login"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors"
          >
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-5">
          <ShieldCheck className="w-7 h-7 text-blue-600" strokeWidth={1.75} />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1.5 text-center">
          Set new password
        </h1>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-7">
          Choose a strong password you haven't used before.
        </p>

        {/* New password */}
        <div className="w-full flex flex-col gap-1.5 mb-4">
          <label
            htmlFor="new-password"
            className="text-xs font-medium text-gray-600 uppercase tracking-wide"
          >
            New password
          </label>
          <div className="relative flex items-center">
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearError();
              }}
              onKeyDown={handleKeyDown}
              disabled={status === "loading"}
              autoFocus
              autoComplete="new-password"
              className="w-full h-10 rounded-lg border border-gray-300 text-sm pl-3 pr-10 text-gray-900 placeholder-gray-400 bg-gray-50 outline-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="w-full flex flex-col gap-1.5 mb-5">
          <label
            htmlFor="confirm-password"
            className="text-xs font-medium text-gray-600 uppercase tracking-wide"
          >
            Confirm password
          </label>
          <div className="relative flex items-center">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError();
              }}
              onKeyDown={handleKeyDown}
              disabled={status === "loading"}
              autoComplete="new-password"
              className={`w-full h-10 rounded-lg border text-sm pl-3 pr-10 text-gray-900 placeholder-gray-400 bg-gray-50 outline-none transition-colors focus:ring-2 disabled:opacity-60 ${
                status === "error" &&
                confirmPassword &&
                newPassword !== confirmPassword
                  ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

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
              Updating password…
            </>
          ) : (
            "Update password"
          )}
        </button>

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
