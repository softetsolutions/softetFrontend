import { useState } from "react";
import { ObjectId } from "bson";
import toast from "react-hot-toast";
import { Building2, Users, Plus, Trash2, X } from "lucide-react";
import { getAuthInfo } from "../utils/auth";
import { createBulkHeadQuarterWithUi } from "../api/headQuarter";

const HierarchyForm = () => {
  const [headquarters, setHeadquarters] = useState([
    {
      id: new ObjectId().toString(),
      name: "",
      location: "",
      areas: [
        {
          id: new ObjectId().toString(),
          name: "",
          doctors: [],
        },
      ],
    },
  ]);
  const [loader, setLoader] = useState(false);
  const [emptyFieldsOnSave, setEmptyFieldsOnSave] = useState({});
  // we have to change the state in the hash map style

  const addHeadquarter = () => {
    setHeadquarters([
      ...headquarters,
      {
        id: new ObjectId().toString(),
        name: "",
        location: "",
        areas: [{ id: new ObjectId().toString(), name: "", doctors: [] }],
      },
    ]);
  };

  const addHeadquarterKeysValue = (hqId, key, value) => {
    const updatedHeadQuarters = headquarters.map((headQuarter) => {
      if (hqId === headQuarter.id) {
        return {
          ...headQuarter,
          [key]: value,
        };
      }
      return headQuarter;
    });

    setHeadquarters(updatedHeadQuarters);
  };

  const removeHeadquarter = (hqId) => {
    setHeadquarters(headquarters.filter((hq) => hq.id !== hqId));
  };

  const addArea = (hqId) => {
    setHeadquarters(
      headquarters.map((hq) => {
        if (hq.id === hqId) {
          return {
            ...hq,
            areas: [
              ...hq.areas,
              { id: new ObjectId().toString(), name: "", doctors: [] },
            ],
          };
        }
        return hq;
      }),
    );
  };

  const addAreaKeysValue = (hqId, areaId, key, value) => {
    const updatedHeadQuarters = headquarters.map((headQuarter) => {
      if (hqId === headQuarter.id) {
        return {
          ...headQuarter,
          areas: headQuarter.areas.map((area) => {
            if (area.id === areaId) {
              return { ...area, [key]: value };
            }
            return area;
          }),
        };
      }

      return headQuarter;
    });
    setHeadquarters(updatedHeadQuarters);
  };

  const removeArea = (hqId, areaId) => {
    setHeadquarters(
      headquarters.map((hq) => {
        if (hq.id === hqId) {
          return {
            ...hq,
            areas: hq.areas.filter((area) => area.id !== areaId),
          };
        }
        return hq;
      }),
    );
  };

  const addDoctor = (hqId, areaId) => {
    setHeadquarters(
      headquarters.map((hq) => {
        if (hq.id === hqId) {
          return {
            ...hq,
            areas: hq.areas.map((area) => {
              if (area.id === areaId) {
                return {
                  ...area,
                  doctors: [
                    ...area.doctors,
                    { id: new ObjectId().toString(), name: "", specialty: "" },
                  ],
                };
              }
              return area;
            }),
          };
        }
        return hq;
      }),
    );
  };

  const addDoctorKeysValue = (hqId, areaId, docId, keys, value) => {
    const updatedHeadQuarters = headquarters.map((headQuarter) => {
      if (hqId === headQuarter.id) {
        return {
          ...headQuarter,
          areas: headQuarter.areas.map((area) => {
            if (areaId === area.id) {
              return {
                ...area,
                doctors: area.doctors.map((doctor) => {
                  if (docId === doctor.id) {
                    return {
                      ...doctor,
                      [keys]: value,
                    };
                  }
                  return doctor;
                }),
              };
            }

            return area;
          }),
        };
      }

      return headQuarter;
    });

    setHeadquarters(updatedHeadQuarters);
  };

  const removeDoctor = (hqId, areaId, docId) => {
    setHeadquarters(
      headquarters.map((hq) => {
        if (hq.id === hqId) {
          return {
            ...hq,
            areas: hq.areas.map((area) => {
              if (area.id === areaId) {
                return {
                  ...area,
                  doctors: area.doctors.filter((doc) => doc.id !== docId),
                };
              }
              return area;
            }),
          };
        }
        return hq;
      }),
    );
  };

  const submitHierarchyHandler = async (payload) => {
    setLoader(true);
    try {
      const orgId = getAuthInfo();
      const emptyFields = {};
      const updatedPayload = payload.reduce(
        (acc, headQuarter) => {
          acc.headquarters.push({
            _id: headQuarter.id,
            headQuarterName: headQuarter.name,
            location: headQuarter.location,
            organizationId: orgId.userId,
          });

          headQuarter.areas.forEach((area) => {
            acc.areas.push({
              _id: area.id,
              name: area.name,
              headQuarterId: headQuarter.id,
              organizationId: orgId.userId,
            });

            area.doctors.forEach((doctor) => {
              acc.doctors.push({
                _id: doctor.id,
                name: doctor.name,
                specialty: doctor.specialty,
                areaId: area.id,
                organizationId: orgId.userId,
              });

              !doctor.name && (emptyFields[doctor.id + ".name"] = 1);
              !doctor.specialty && (emptyFields[doctor.id + ".specialty"] = 1);
            });

            !area.name && (emptyFields[area.id + ".name"] = 1);
          });

          !headQuarter.name && (emptyFields[headQuarter.id + ".name"] = 1);
          !headQuarter.location &&
            (emptyFields[headQuarter.id + ".location"] = 1);

          return acc;
        },
        {
          headquarters: [],
          doctors: [],
          areas: [],
        },
      );

      if (Object.keys(emptyFields).length) {
        setEmptyFieldsOnSave(emptyFields);
        return;
      }

      const data = await createBulkHeadQuarterWithUi({
        hierrarchy: updatedPayload,
      });

      toast.success("Headquarters , areas and doctors are successfully added");

      setHeadquarters([
        {
          id: new ObjectId().toString(),
          name: "",
          location: "",
          areas: [
            {
              id: new ObjectId().toString(),
              name: "",
              doctors: [],
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("Got some issue while creating the hierrarchy", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <header className="mb-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">Headquarters</h1>
          <button
            disabled={loader}
            onClick={() => submitHierarchyHandler(headquarters)}
            className={`flex items-center gap-1 text-white px-4 py-2 rounded cursor-pointer ${loader ? "bg-blue-400" : "bg-blue-600"}`}
          >
            <div>{loader ? "Saving..." : "Save"}</div>
            {loader && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </div>

        <p className="text-gray-500 mt-1 italic">
          You can add multiple headquarters, and within each headquarters, you
          can add multiple areas. Each area can also include multiple doctors.
        </p>
      </header>
      <div className="space-y-8 overflow-y-auto">
        {headquarters.map((hq, hqIndex) => (
          <div
            key={hq.id}
            className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Headquarter Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Headquarter {hqIndex + 1}</span>
              </div>
              {headquarters.length > 1 && (
                <button
                  onClick={() => removeHeadquarter(hq.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Headquarter Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="HQ Name"
                    className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-100 ${emptyFieldsOnSave[hq.id + ".name"] ? "border-red-400" : ""}`}
                    onChange={(e) =>
                      addHeadquarterKeysValue(hq.id, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State"
                    className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-100 ${emptyFieldsOnSave[hq.id + ".location"] ? "border-red-400" : ""}`}
                    onChange={(e) =>
                      addHeadquarterKeysValue(hq.id, "location", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Areas Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Regional Areas
                  </h4>
                  <button
                    onClick={() => addArea(hq.id)}
                    className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Area
                  </button>
                </div>

                <div className="space-y-4 ml-4 border-l-2 border-slate-100 pl-6">
                  {hq.areas.map((area) => (
                    <div
                      key={area.id}
                      className="p-4 border border-slate-200 rounded-md bg-white space-y-4 relative group"
                    >
                      <button
                        onClick={() => removeArea(hq.id, area.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                          Area Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Downtown"
                          className={`w-full px-3 py-2 border rounded-md text-sm outline-none ${emptyFieldsOnSave[area.id + ".name"] ? "border-red-400" : ""}`}
                          onChange={(e) =>
                            addAreaKeysValue(
                              hq.id,
                              area.id,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      {/* Doctors within Area */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                          <Users className="w-3 h-3" /> Doctors
                        </div>
                        <div className="space-y-2">
                          {area.doctors.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="text"
                                placeholder="Name"
                                className={`flex-1 px-3 py-1.5 border rounded text-sm ${emptyFieldsOnSave[doc.id + ".name"] ? "border-red-400" : ""}`}
                                onChange={(e) =>
                                  addDoctorKeysValue(
                                    hq.id,
                                    area.id,
                                    doc.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="Specialty"
                                className={`flex-1 px-3 py-1.5 border rounded text-sm ${emptyFieldsOnSave[doc.id + ".specialty"] ? "border-red-400" : ""}`}
                                onChange={(e) =>
                                  addDoctorKeysValue(
                                    hq.id,
                                    area.id,
                                    doc.id,
                                    "specialty",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  removeDoctor(hq.id, area.id, doc.id)
                                }
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => addDoctor(hq.id, area.id)}
                          className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3 h-3" /> Add Doctor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addHeadquarter}
          className="w-full py-6 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all flex flex-col items-center gap-1"
        >
          <Building2 className="w-6 h-6" />
          <span>Add Another Headquarter</span>
        </button>
      </div>
    </>
  );
};

export default HierarchyForm;
