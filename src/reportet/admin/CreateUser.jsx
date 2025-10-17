import React, { useState, useEffect } from "react";
import { getAllMrs, createMr } from "../api/mr";
import toast from "react-hot-toast";

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    email: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'






  // Fetch MRs on component mount
  useEffect(() => {
  if (message.text) {
    const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    return () => clearTimeout(timer); // cleanup if message changes before 5s
  }
}, [message]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all MRs
  const fetchUsers = async () => {
    try {
      const data = await getAllMrs();
       console.log("Fetched MRs:", data); // returns array of MRs
      setUsers(data);
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    }
  };

  // Handle creating a new MR
  const handleSave = async () => {
    try {
      const { firstName, lastName, userName, password,email } = formData;
      if (!firstName || !lastName || !userName || !password ) {
        setMessage({ text: "All fields are required", type: "error" });
        toast.error("Please fill all required fields");
        return;
      }

      const newMr = await createMr(formData); // API returns created MR
      toast.success("MR created successfully");

      // Update UI without refetching
      setUsers(prev => [newMr, ...prev]);

      // Clear form
      setFormData({ firstName: "", lastName: "", userName: "", password: "", email: "" });
      setMessage({ text: "MR created successfully", type: "success" });
    } catch (error) {
      setMessage({ text: error.message || "Failed to create MR", type: "error" });
      toast.error(error.message || "Failed to create MR");
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const displayName = `${user?.firstName} ${user?.lastName}`;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create MR</h2>
       {/* Success / Error message */}
    {message.text && (
      <div
        className={`mb-4 p-2 rounded text-sm ${
          message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {message.text}
      </div>
    )}

      {/* Form */}
      <div className="space-y-4 bg-white p-6 rounded shadow">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <Input
          label="User Name"
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        />
        <Input
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search MR..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <ul className="border rounded max-h-48 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <li className="p-2 text-gray-500">No MRs found.</li>
          ) : (
            filteredUsers.map(user => (
              <li key={user?._id || user?.id} className="p-2 border-b last:border-b-0">
                {user?.firstName} {user?.lastName}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

// Reusable Input component
const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
);

export default CreateUser;
