import React, { useState, useEffect, useContext } from "react";
import { getAllMrs, createMr, updateMr } from "../api/mr.js";
import toast from "react-hot-toast";
import { MrContext } from "../context/MrContext";

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { editMr, setEditMr } = useContext(MrContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    if (editMr) {
      setFormData({
        firstName: editMr.firstName,
        lastName: editMr.lastName,
        userName: editMr.userName,
        email: editMr.email,
        password: "",
      });
    }
  }, [editMr]);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllMrs();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleSave = async () => {
    try {
      const { firstName, lastName, userName, password, email } = formData;

      if (!firstName || !lastName || !userName || !password || !email) {
        toast.error("All fields required");
        return;
      }

      if (editMr) {
        const updated = await updateMr(editMr._id, formData);
        setUsers(prev => prev.map(u => (u._id === updated._id ? updated : u)));
        toast.success("MR Updated");
        setEditMr(null);
      } else {
        const created = await createMr(formData);
        setUsers(prev => [created, ...prev]);
        toast.success("MR Created");
      }

      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        email: "",
      });

    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">
        {editMr ? "Edit MR" : "Create MR"}
      </h2>

      <div className="space-y-4 bg-white p-6 rounded shadow">
        <Input label="First Name" value={formData.firstName}
               onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />

        <Input label="Last Name" value={formData.lastName}
               onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />

        <Input label="User Name" value={formData.userName}
               onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />

        <Input label="Email" value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        <Input label="Password" type="password" value={formData.password}
               onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

        <button onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
          {editMr ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input type={type} value={value} onChange={onChange}
           className="w-full p-2 border rounded mt-1" />
  </div>
);

export default CreateUser;
  