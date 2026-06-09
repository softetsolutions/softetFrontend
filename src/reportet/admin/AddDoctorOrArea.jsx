import { useState, useEffect } from "react";
import { ObjectId } from "bson";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Select } from "../genericComps/InputComps";
import { getAllHeadQuartersNames } from "../api/headQuarter";
import { getAreasByHeadQuarterId, createArea } from "../api/area";
import { addDoctors } from "../api/doctor";

const addOptions = [
  {
    name: "Area",
    value: "area",
  },
  {
    name: "Doctor",
    value: "doctor",
  },
];

const AddDoctorOrArea = () => {
  const [mode, setMode] = useState(""); //area or doctor
  const [loader, setLoader] = useState(false);
  const [addedAreaList, setAddedAreaList] = useState([
    {
      id: new ObjectId().toString(),
      name: "",
    },
  ]);
  const [addedDocterList, setAddedDoctorList] = useState([
    {
      id: new ObjectId().toString(),
      name: "",
      speciallity: "",
    },
  ]);
  const [headQuartersOptions, setHeadQuartersOptions] = useState([]);
  const [selectedHeadQuarter, setSelectedHeadQuarter] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [duplicateFields, setDuplicateFields] = useState({});
  const [emptyFields, setEmptyFields] = useState({});

  console.log("selectedHeadQuarter is", selectedHeadQuarter);

  const fetchHeadQuartersNames = async () => {
    try {
      setLoader(true);
      const { headQuarterNames } = await getAllHeadQuartersNames();
      const headQuartersOptions = headQuarterNames.map((headQuarter) => ({
        name: headQuarter?.headQuarterName,
        value: headQuarter?._id,
      }));
      setHeadQuartersOptions(headQuartersOptions);
      setLoader(false);
    } catch (error) {
      console.error("Error in fetching headQuarters", error);
      toast.error("Error in fetching headQuarters");
      setLoader(false);
    }
  };

  const removeDoctor = (doctorId) => {
    const newAddesDoctors = addedDocterList.filter(
      (doc) => doc.id !== doctorId,
    );
    setAddedDoctorList(newAddesDoctors);
  };

  const removeArea = (areaId) => {
    const newAddedAreaList = addedAreaList.filter(
      (area) => area?.id !== areaId,
    );
    setAddedAreaList(newAddedAreaList);
  };

  const addDoctorDetails = (docotrId, key, value) => {
    const newAddedDoctorList = addedDocterList.map((doc) => {
      if (doc.id === docotrId) {
        return {
          ...doc,
          [key]: value,
        };
      }
      return doc;
    });
    setAddedDoctorList(newAddedDoctorList);
  };

  const addAreaDetails = (areaId, key, value) => {
    setDuplicateFields({});
    setEmptyFields({});
    const newAreaAddedList = addedAreaList?.map((area) => {
      if (area.id === areaId) {
        return {
          ...area,
          [key]: value,
        };
      }
      return area;
    });
    setAddedAreaList(newAreaAddedList);
  };

  const handleHeadQuarterSelection = async (event) => {
    try {
      const selectedHeadQuarterId = event.target.value;
      if (mode === "doctor") {
        const res = await getAreasByHeadQuarterId(selectedHeadQuarterId);
        console.log("Selected headquarter area is", res);
        const areaOptions = res.data.map((doctor) => ({
          name: doctor?.name,
          value: doctor?._id,
        }));
        setAreaOptions(areaOptions);
      }

      setSelectedHeadQuarter(selectedHeadQuarterId);
    } catch (error) {
      console.error("Unable to fetch area", error);
      toast.error("Unable to select headquarter");
    }
  };

  const handleModeChange = async (event) => {
    const mode = event?.target?.value;
    setDuplicateFields({});
    setEmptyFields({});
    setSelectedHeadQuarter("");
    setSelectedArea("");
    setAreaOptions([]);
    setAddedDoctorList([
      {
        id: new ObjectId().toString(),
        name: "",
        speciallity: "",
      },
    ]);
    setMode(mode);
  };

  const handleSubmit = async () => {
    try {
      let payload = {};
      const emptyFields = {};
      const repeatingField = {};
      if (mode === "area") {
        payload = addedAreaList.reduce((acc, area) => {
          if (area.name && !acc[area.name]) {
            acc[area.name] = {
              headQuarterId: selectedHeadQuarter,
            };
          } else if (acc[area.name]) {
            repeatingField[area?.id] = true;
          } else if (!area?.name) {
            emptyFields[area?.id] = true;
          }

          return acc;
        }, {});

        if (
          Object.keys(repeatingField).length ||
          Object.keys(emptyFields).length
        ) {
          Object.keys(repeatingField).length &&
            setDuplicateFields(repeatingField);
          Object.keys(emptyFields).length && setEmptyFields(emptyFields);
          toast.error(
            "Please remove duplicate areas and ensure all fields are filled.",
          );
          return;
        }

        const data = await createArea({
          areaData: payload,
        });

        if (data.success) {
          toast.success(data?.message);
          setSelectedHeadQuarter("");
          setSelectedArea("");
          setAreaOptions([]);
          setAddedDoctorList([
            {
              id: new ObjectId().toString(),
              name: "",
              speciallity: "",
            },
          ]);
        }
      } else if (mode === "doctor") {
        payload = addedDocterList.reduce((acc, doctor) => {
          if (doctor.name && !acc[doctor.name]) {
            acc[doctor.name] = {
              specialty: doctor?.speciallity,
              areaId: selectedArea,
            };
          } else if (acc[doctor.name]) {
            repeatingField[doctor?.id] = true;
          } else if (!doctor?.name) {
            emptyFields[doctor?.id] = true;
          }
          return acc;
        }, {});

        if (
          Object.keys(repeatingField).length ||
          Object.keys(emptyFields).length
        ) {
          Object.keys(repeatingField).length &&
            setDuplicateFields(repeatingField);
          Object.keys(emptyFields).length && setEmptyFields(emptyFields);
          toast.error(
            "Please remove duplicate doctors and ensure all required fields are filled.",
          );
          return;
        }

        const data = await addDoctors({
          doctorData: payload,
        });

        if (data?.success) {
          toast.success(data?.message);
          setSelectedHeadQuarter("");
          setSelectedArea("");
          setAreaOptions([]);
          setAddedDoctorList([
            {
              id: new ObjectId().toString(),
              name: "",
              speciallity: "",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error in adding areas", error);
      toast.error("Cant add areas. Pls try again later");
    }
  };

  useEffect(() => {
    fetchHeadQuartersNames();
  }, []);

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-800">Add Doctors/Areas</h2>
      <p className="text-gray-600 mb-6 pb-2 italic">
        Add multiple doctors/areas in an headquarter.
      </p>
      <div
        style={{ height: "calc(100% - 90px)", overflow: "auto" }}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md h-full"
      >
        <Select
          labelName={"area/doctor"}
          value={mode}
          onChange={handleModeChange}
          required={true}
          options={addOptions}
          selectName={"What do you want to add?"}
        />

        {mode && (
          <Select
            labelName={"headQuarter"}
            value={selectedHeadQuarter}
            onChange={handleHeadQuarterSelection}
            required={true}
            options={headQuartersOptions}
            selectName={"Choose Headquarter"}
          />
        )}

        <>
          {/* Area Dropdown */}
          {mode === "doctor" && selectedHeadQuarter && (
            <div>
              <Select
                selectName={"Choose Area"}
                labelName={"Area"}
                value={selectedArea}
                options={areaOptions}
                required={true}
                onChange={(event) => setSelectedArea(event.target.value)}
              />
            </div>
          )}

          {mode === "doctor" && selectedHeadQuarter && selectedArea && (
            <>
              {addedDocterList?.map((doctor) => (
                <div key={doctor?.id} className="flex justify-between relative">
                  <Input
                    label="Doctor Name"
                    placeholder="Enter doctor name"
                    style={{ width: "48%" }}
                    value={doctor.name}
                    onChange={(e) =>
                      addDoctorDetails(doctor?.id, "name", e.target.value)
                    }
                    inputClassName={
                      duplicateFields[doctor?.id] || emptyFields[doctor?.id]
                        ? " border-red-400"
                        : ""
                    }
                    required
                  />
                  <Input
                    label="Specialization"
                    placeholder="Enter doctor's speciality"
                    style={{ width: "48%" }}
                    value={doctor.speciallity}
                    onChange={(e) =>
                      addDoctorDetails(
                        doctor?.id,
                        "speciallity",
                        e.target.value,
                      )
                    }
                  />

                  <button
                    onClick={() => {
                      removeDoctor(doctor.id);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors absolute top-0 right-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  className="bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500"
                  onClick={() =>
                    setAddedDoctorList([
                      ...addedDocterList,
                      {
                        id: new ObjectId().toString(),
                        name: "",
                        speciallity: "",
                      },
                    ])
                  }
                >
                  Add More Doctor
                </button>
              </div>
            </>
          )}

          {mode === "area" && selectedHeadQuarter && (
            <>
              {addedAreaList?.map((area) => (
                <div key={area?.id} className="relative">
                  <Input
                    label={"Add Area"}
                    value={area?.name}
                    onChange={(e) =>
                      addAreaDetails(area?.id, "name", e.target.value)
                    }
                    required
                    inputClassName={
                      duplicateFields[area?.id] || emptyFields[area?.id]
                        ? " border-red-400"
                        : ""
                    }
                  />
                  <button
                    onClick={() => {
                      removeArea(area?.id);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors absolute top-0 right-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  className="bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500"
                  onClick={() =>
                    setAddedAreaList([
                      ...addedAreaList,
                      {
                        id: new ObjectId().toString(),
                        name: "",
                      },
                    ])
                  }
                >
                  Add More Area
                </button>
              </div>
            </>
          )}

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
            // disabled={loading}
          >
            {/* {loading ? "Submitting..." : "Submit All"} */}
            Submit
          </button>
        </>
      </div>
    </div>
  );
};

export default AddDoctorOrArea;
