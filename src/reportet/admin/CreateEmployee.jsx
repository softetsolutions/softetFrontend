import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getAllHeadQuartersNames } from "../api/headQuarter.js";
import { onboardEmployee } from "../api/api.js";
import { Input } from "../genericComps/InputComps.jsx";
import { EyeOff, Eye } from "lucide-react";

const CreateEmployee = () => {
  const [selectedHeadQuarters, setSelectedHeadQuarters] = useState([]);
  const [headQuartersNames, setHeadQuartersNames] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    password: "",
    email: "",
    phoneNumber: undefined,
    role: "",
  });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    // fetchUsers();
    fetchHeadQuartersNames();
  }, []);

  const fetchHeadQuartersNames = async () => {
    try {
      const data = await getAllHeadQuartersNames();

      let headQuarterNames = data?.headQuarterNames.reduce(
        (acc, headQuarter) => {
          acc[headQuarter?.headQuarterName] = headQuarter._id;
          return acc;
        },
        {},
      );
      setHeadQuartersNames(headQuarterNames);
    } catch (error) {
      console.error("error is", error);
      toast.error("Failed to fetch headquarters", error.message);
    }
  };

  const handleSave = async () => {
    try {
      const {
        firstName,
        lastName,
        employeeId,
        password,
        email,
        role,
        phoneNumber,
      } = formData;

      if (
        !firstName ||
        !lastName ||
        !employeeId ||
        !password ||
        !email ||
        !role ||
        !phoneNumber
      ) {
        toast.error("Fields with * mark are mandatory");
        return;
      }

      const data = await onboardEmployee({
        firstName: formData?.firstName.trim(),
        lastName: formData?.lastName.trim(),
        employeeId: formData?.employeeId.trim(),
        password: formData?.password,
        email: formData?.email.trim(),
        phoneNumber: formData?.phoneNumber,
        role: formData?.role?.trim(),
        assignedHeadQuarters: selectedHeadQuarters?.map((headQuarter) => {
          return headQuartersNames[headQuarter];
        }),
      });

      if (data.success) {
        setFormData({
          firstName: "",
          lastName: "",
          employeeId: "",
          password: "",
          email: "",
          phoneNumber: undefined,
          role: "",
        });
        setSelectedHeadQuarters([]);
        toast.success(data.message);
        return;
      }
      toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
      console.error("Error in onboarding new Employee", err.message);
    }
  };

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold mb-2">Onboard Employee</h2>

      <div
        style={{ height: "calc(100% - 40px)", overflow: "auto" }}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />

        <Input
          label="Employee Id"
          value={formData.employeeId}
          onChange={(e) =>
            setFormData({ ...formData, employeeId: e.target.value })
          }
          required
        />

        <Input
          label="Phone Number"
          type="number"
          value={formData.phoneNumber ? formData.phoneNumber : ""}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />

        <Input
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <div
            className=" absolute top-8 right-2 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </div>
        </div>

        <div>
          <label htmlFor="roles" className="block text-sm font-medium">
            Role <span className=" text-red-500">*</span>
          </label>
          <select
            name="roles"
            className="w-full p-2 border rounded mt-1"
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, role: event?.target?.value }))
            }
            value={formData.role}
          >
            <option value="">Choose Role</option>
            <option value="mr">MR</option>
            <option value="areaManager">Area Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Assign Headquarters
          </label>
          {formData?.role === "areaManager" && (
            <Select
              multiple
              value={selectedHeadQuarters}
              onChange={(e) => setSelectedHeadQuarters(e.target.value)}
              className="w-full border border-black-300 rounded mt-1 text-sm bg-white"
              sx={{
                height: "42px",
                ".MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                ".MuiSelect-select": {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingLeft: "12px",
                },
              }}
              aria-placeholder="Choose HeadQuarters"
            >
              {Object.keys(headQuartersNames).map((headQuarter) => (
                <MenuItem
                  key={headQuarter}
                  value={headQuarter}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#B3D7FF !important",
                    },
                  }}
                >
                  {headQuarter}
                </MenuItem>
              ))}
            </Select>
          )}

          {formData?.role === "mr" && (
            <select
              name="roles"
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setSelectedHeadQuarters([e.target.value])}
            >
              <option value={""}>Choose Headquarter</option>
              {Object.keys(headQuartersNames).map((headQuarter) => (
                <option value={headQuarter} key={headQuarter}>
                  {headQuarter}
                </option>
              ))}
            </select>
          )}

          {formData?.role === "" && (
            <div className="flex items-center h-10.5 border border-black mt-1 pl-1.5 rounded">
              Choose roles first
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateEmployee;
