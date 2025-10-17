import { useState, useEffect } from "react";
import { getAllMrs } from "../api/mr";
import { getAllDoctors } from "../api/doctor"; 
import { assignDoctorToMR } from "../api/doctor";
import toast from "react-hot-toast";

const AssignDoctor = () => {
  const [mrs, setMrs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedMr, setSelectedMr] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'
      useEffect(() => {
      if (message.text) {
        const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        return () => clearTimeout(timer); // cleanup if message changes before 5s
      }
    }, [message]);


  // Fetch MRs & Doctors
  useEffect(() => {
    (async () => {
      try {
        const mrData = await getAllMrs();
        setMrs(mrData);
        console.log("MRs:", mrData);

        const doctorData = await getAllDoctors();
        setDoctors(doctorData);
        console.log("Doctors:", doctorData);
      } catch (err) {
        toast.error("Failed to load MRs or Doctors");
      }
    })();
  }, []);

  const handleAssign = async () => {
    if (!selectedMr || !selectedDoctor) {
      setMessage({text:"Please Select Both MR and Doctor",type:"error"})
      toast.error("Please select both MR and Doctor");
      return;
    }
    setLoading(true);
    try {
      await assignDoctorToMR(selectedMr, selectedDoctor);
      setMessage({text:"Doctor assigned successfully!",type:"success"})
      toast.success("Doctor assigned successfully!");
      setSelectedMr("");
      setSelectedDoctor("");
    } catch (err) {
      setMessage({text:"Failed to assign Doctor",type:"error"})
      toast.error(err.message || "Failed to assign doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
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
      <h2 className="text-2xl font-bold text-gray-800">Assign Doctor to MR</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Select an MR and assign a doctor to them.
      </p>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* MR Dropdown */}
        <div className="text-black">
          <label className="block mb-1">Select MR:</label>
          <select
            value={selectedMr}
            onChange={(e) => setSelectedMr(e.target.value)}
            className="w-full border p-2 rounded text-black"
          >
            <option value="" className="bg-white text-black">
              -- Select MR --
            </option>
            {mrs.map((mr) => (
              <option key={mr._id} value={mr._id}>
                {mr.firstName} {mr.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Dropdown */}
        <div>
          <label className="block mb-1">Select Doctor:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAssign}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Doctor"}
        </button>
      </div>
    </div>
  );
};

export default AssignDoctor;
