import React, { useState } from "react";

const ProfileModal = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 98765 43210",
  };
  console.log("Profile user:", storedUser);

  const [user, setUser] = useState(storedUser);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownloadAppointmentLetter = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5005/api/download-appointment-letter",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setUser((prev) => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => setUser((prev) => ({ ...prev, photo: null }));
  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
    alert("Profile updated! (Demo storage)");
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

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src={user.photo || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-blue-200 shadow-sm"
          />
          {editing && (
            <div className="flex gap-2 mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-sm text-gray-600"
              />
              {user.photo && (
                <button
                  onClick={handleRemovePhoto}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="font-medium text-gray-700 capitalize">
                {field}:
              </label>
              {editing ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              ) : (
                <p className="mt-1 text-gray-800">{user[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
