import React, { useState } from "react";
const API = import.meta.env.VITE_API_BASE_URL;

const ProfileModal = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 98765 43210",
    course: "Industrial Training",
  };
  // console.log("Profile user:", storedUser);

  const [user, setUser] = useState(storedUser);
  // const [editing, setEditing] = useState(false);
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
        }
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUser((prev) => ({ ...prev, [name]: value }));
  // };

  // const handlePhotoChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () =>
  //       setUser((prev) => ({ ...prev, photo: reader.result }));
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRemovePhoto = () => setUser((prev) => ({ ...prev, photo: null }));
  // const handleSave = () => {
  //   localStorage.setItem("user", JSON.stringify(user));
  //   setEditing(false);
  //   alert("Profile updated! (Demo storage)");
  // };

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

        {/* Profile Picture
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src={user.photo || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-blue-200 shadow-sm"
          />
        </div> */}

        {/* Profile Fields */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {["name", "email", "phone", "course"].map((field) => (
            <div key={field}>
              <label className="font-medium text-gray-700 capitalize">
                {field}:
              </label>
              <p className="mt-1 text-gray-800">{user[field]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
