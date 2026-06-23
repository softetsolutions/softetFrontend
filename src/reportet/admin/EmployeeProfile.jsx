import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllHeadQuartersNames } from "../api/headQuarter";
import Spinner from "../genericComps/Spinner";
import {
  PhoneCall,
  Mail,
  Building2,
  BadgeCheck,
  Calendar,
  ArrowLeft,
  Pencil,
  X,
  Check,
  UserX,
  UserCheck,
} from "lucide-react";
import {
  getEmployeeById,
  updateEmployee,
  getAllEmployeeNames,
} from "../api/employee";
import { formatDate } from "../utils/helperFunctions";

const EmployeeDetail = ({ preloadedEmployeeId }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allHeadQuarters, setAllHeadQuarters] = useState([]);
  const [hqsLoading, setHqsLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    assignedAreas: "",
    assignedDoctors: "",
  });

  const [hqInput, setHqInput] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployeeNames();
      setAllEmployees(data.employees || []);
    } catch (error) {
      toast.error("Failed to fetch employees list");
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllHeadQuarters = async () => {
    try {
      setHqsLoading(true);
      const data = await getAllHeadQuartersNames();
      setAllHeadQuarters(data.headQuarterNames || []);
    } catch (error) {
      toast.error("Failed to fetch headquarters list");
    } finally {
      setHqsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHeadQuarters();
  }, []);
  useEffect(() => {
    if (preloadedEmployeeId) {
      setSearchInput(String(preloadedEmployeeId));
      setEmployeeId(String(preloadedEmployeeId));
    }
  }, [preloadedEmployeeId]);

  const handleAssignHQ = async (hqId) => {
    try {
      const data = await updateEmployee(employeeId, {
        addHeadQuarters: [hqId],
      });
      setEmployee(data.employee);
      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to assign headquarter");
    }
  };

  const handleUnassignHQ = async (hqId) => {
    try {
      const data = await updateEmployee(employeeId, {
        removeHeadQuarters: [hqId],
      });
      setEmployee(data.employee);
      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to unassign headquarter");
    }
  };

  const fetchEmployee = async () => {
    try {
      setLoading(true);

      setSearching(true);
      const data = await getEmployeeById(employeeId);
      setEmployee(data.employee);
      setForm({
        firstName: data.employee.firstName || "",
        lastName: data.employee.lastName || "",
        email: data.employee.email || "",
        phoneNumber: data.employee.phoneNumber || "",
        role: data.employee.role || "",
        assignedAreas: data.employee.assignedAreas || "",
        assignedDoctors: data.employee.assignedDoctors || "",
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error("Failed to fetch employee details");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  const handleToggleStatus = async () => {
    try {
      const newStatus = !employee.isActive;
      const data = await updateEmployee(employeeId, { isActive: newStatus });

      setEmployee({
        ...data.employee,
        isActive: data.employee.isActive ?? newStatus,
      });
      toast.success(data.message);
    } catch (error) {
      console.error("Error toggling employee status:", error);
      toast.error("Failed to update employee status");
    }
  };
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = await updateEmployee(employeeId, form);
      setEmployee(data.employee);
      toast.success("Employee updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phoneNumber: employee.phoneNumber || "",
      role: employee.role || "",
      area: employee.assignedAreas || "",
      doctor: employee.assignedDoctors || "",
    });
    setEditMode(false);
  };
  useEffect(() => {
    const handler = (e) => {
      const id = String(e.detail);
      setSearchInput(id);
      setEmployeeId(id);
    };
    window.addEventListener("set-employee-id", handler);
    return () => window.removeEventListener("set-employee-id", handler);
  }, []);

  const filteredSuggestions = allEmployees.filter((emp) => {
    if (!searchInput.trim()) return false;
    const term = searchInput.toLowerCase();
    return (
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
      String(emp.employeeId).toLowerCase().includes(term)
    );
  });

  if (!employeeId) {
    return (
      <div className="bg-gray-100 flex flex-col h-full">
        <header className="mb-6 flex items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Employee Profile
          </h1>
        </header>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-3 items-center relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter Employee ID or search by name..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) =>
                e.key === "Enter" && setEmployeeId(searchInput.trim())
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredSuggestions.map((emp) => (
                  <li
                    key={emp._id}
                    onClick={() => {
                      setSearchInput(String(emp.employeeId));
                      setEmployeeId(String(emp.employeeId));
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex justify-between"
                  >
                    <span>
                      {emp.firstName} {emp.lastName}
                    </span>
                    <span className="text-gray-400">{emp.employeeId}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => setEmployeeId(searchInput.trim())}
            disabled={searching}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {searching && (
              <Spinner
                size={16}
                borderWidth={2}
                className="border-white border-t-transparent"
              />
            )}
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
        <p className="text-gray-500 text-sm italic text-center mt-10">
          Enter an Employee ID above to view details.
        </p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-gray-100 flex flex-col h-full">
        <div className="text-center py-6 text-gray-500 text-sm">
          <Spinner size={48} borderWidth={4} />
          <p className="text-sm text-gray-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-gray-100 flex flex-col h-full">
        <div className="text-center py-6 text-gray-500 text-sm">
          Employee not found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex flex-col h-full overflow-y-auto">
      <header className="mb-8 flex justify-between items-center">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-3 items-center relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter Employee ID or search by name..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) =>
                e.key === "Enter" && setEmployeeId(searchInput.trim())
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredSuggestions.map((emp) => (
                  <li
                    key={emp._id}
                    onClick={() => {
                      setSearchInput(String(emp.employeeId));
                      setEmployeeId(String(emp.employeeId));
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex justify-between"
                  >
                    <span>
                      {emp.firstName} {emp.lastName}
                    </span>
                    <span className="text-gray-400">{emp.employeeId}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => setEmployeeId(searchInput.trim())}
            disabled={searching}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-70"
          >
            {searching && (
              <Spinner
                size={16}
                borderWidth={2}
                className="border-white border-t-transparent"
              />
            )}
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Employee Details
            </h1>
            <p className="text-gray-500 mt-1 italic">
              View and manage employee information.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving && (
                  <Spinner
                    size={16}
                    borderWidth={2}
                    className="border-white border-t-transparent"
                  />
                )}
                <Check size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                  employee.isActive
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {employee.isActive ? (
                  <>
                    <UserX size={16} /> Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck size={16} /> Activate
                  </>
                )}
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                <Pencil size={16} /> Edit Employee
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {employee.firstName?.[0]}
              {employee.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {employee.displayName}
              </h2>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                {employee.role}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                  employee.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {employee.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </label>
              {editMode ? (
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-800">
                  {employee.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </label>
              {editMode ? (
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-800">
                  {employee.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </label>
              {editMode ? (
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-800">
                    {employee.email || "Not available"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </label>
              {editMode ? (
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <PhoneCall size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-800">
                    {employee.phoneNumber || "Not available"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </label>
              {editMode ? (
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mr">MR</option>
                  <option value="areaManager">Area Manager</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <BadgeCheck size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-800 capitalize">
                    {employee.role}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Areas
              </label>
              {employee.assignedAreas?.length > 0 ? (
                <select className="mt-1 w-40 border border-gray-300 rounded-md px-2 py-1 text-xs bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option disabled selected>
                    {employee.assignedAreas.length} area(s) assigned
                  </option>
                  {employee.assignedAreas.map((a) => (
                    <option key={a._id} disabled>
                      {a.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not assigned</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Doctors
              </label>
              {employee.assignedDoctors?.length > 0 ? (
                <select className="mt-1 w-40 border border-gray-300 rounded-md px-2 py-1 text-xs bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option disabled selected>
                    {employee.assignedDoctors.length} doctor(s) assigned
                  </option>
                  {employee.assignedDoctors.map((d) => (
                    <option key={d._id} disabled>
                      {d.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not assigned</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </label>
              <p className="mt-1 text-sm text-gray-800">
                {employee.employeeId}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-gray-400" />
                <p className="text-sm text-gray-800">
                  {formatDate(employee.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Assigned HeadQuarters
            </h3>
          </div>

          {employee.assignedHeadQuarters?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {employee.assignedHeadQuarters.map((hq) => (
                <span
                  key={hq._id}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  <Building2 size={14} />
                  {hq.headQuarterName}

                  <button
                    onClick={() => handleUnassignHQ(hq._id)}
                    className="ml-1 text-blue-400 hover:text-red-500 transition-colors"
                    title="Unassign"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              No headquarters assigned.
            </p>
          )}

          <div className="flex gap-2 items-center">
            <select
              value={hqInput}
              onChange={(e) => setHqInput(e.target.value)}
              disabled={hqsLoading}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {hqsLoading
                  ? "Loading headquarters..."
                  : "Select a headquarter..."}
              </option>
              {allHeadQuarters
                .filter(
                  (hq) =>
                    !employee.assignedHeadQuarters?.some(
                      (assigned) => assigned._id === hq._id,
                    ),
                )
                .map((hq) => (
                  <option key={hq._id} value={hq._id}>
                    {hq.headQuarterName}
                  </option>
                ))}
            </select>

            <button
              onClick={() => {
                if (hqInput.trim()) {
                  handleAssignHQ(hqInput.trim());
                  setHqInput("");
                }
              }}
              disabled={!hqInput || hqsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Building2 size={14} /> Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
