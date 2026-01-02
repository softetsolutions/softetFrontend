import React from "react";

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Profile</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium">Name: </span>
            {user.name}
          </p>
          <p>
            <span className="font-medium">Email: </span>
            {user.email}
          </p>
          <p>
            <span className="font-medium">Phone: </span>
            {user.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
