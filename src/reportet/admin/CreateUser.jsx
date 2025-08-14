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
    mobile: "",
    address: "",
    area: "",
    password: "",
    status: "",
  });

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllMrs();
      setUsers(data);
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    }
  };

  // Create a new MR
  const handleSave = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.userName || !formData.password) {
        toast.error("Please fill all required fields");
        return;
      }
      await createMr({
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        password: formData.password,
      });
      toast.success("User created successfully");
      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
      });
      fetchUsers(); 
    } catch (error) {
      toast.error(error.message || "Failed to create user");
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter(user =>
    (user.displayName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 ">Create MR</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Please fill in the details below to create or update a user.
      </p>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <Input
          label="First Name"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <Input
          label="Last Name"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <Input
          label="User Name"
          placeholder="Enter user name"
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />


        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-8 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search MR
        </label>
        <input
          type="text"
          placeholder="Search by user name"
          className="w-full px-3 py-2 border rounded-md shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* User list */}
        <ul className="mt-4 border rounded-md max-h-48 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <li className="p-3 text-gray-500">No users found.</li>
          ) : (
            filteredUsers.map((user) => (
              <li
                key={user._id}
                className="p-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
              >
                <strong>{user.displayName}</strong>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
    />
  </div>
);

export default CreateUser;
