import { useState } from "react";
const API = import.meta.env.VITE_API_BASE_URL;

const ProfileModal = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user] = useState(storedUser);
  const [loading, setLoading] = useState(false);

  const handleDownloadAppointmentLetter = async () => {
    try {
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?._id) {
        alert("User ID missing");
        return;
      }

      const res = await fetch(
        `${API}/api/download-appointment-letter/${userData._id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to download");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Appointment_Letter.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-8 px-6">
      {/* Top-right Download Button */}
      <div className="flex justify-end mb-4 -mr-9">
        <button
          onClick={handleDownloadAppointmentLetter}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Downloading..." : "Download Appointment Letter"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="space-y-6">
        {/* Centered Title */}
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">
          Profile
        </h2>

        {/* Profile Fields */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {["name", "email", "phone", "course"].map((field) => (
            <div key={field}>
              <label className="font-medium text-gray-700 capitalize">
                {field}:
              </label>
              <p className="mt-1 text-gray-800">
                {user[field] || "Not available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
