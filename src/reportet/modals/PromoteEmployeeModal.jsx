import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { X, TrendingUp } from "lucide-react";
import Spinner from "../genericComps/Spinner";
import { promoteEmployee } from "../api/employee";
import { getAllHeadQuartersNames } from "../api/headQuarter";
import { getZoneOptions } from "../api/zone";
import { roleMaper } from "../utils/mappers";

const NEXT_ROLE = {
  mr: "areaManager",
  areaManager: "zonalManager",
};

const selectSx = {
  height: "42px",
  ".MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
  ".MuiSelect-select": {
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "12px",
  },
};

const PromoteEmployeeModal = ({ employee, onClose, onPromoted }) => {
  const toRole = NEXT_ROLE[employee?.role];
  const [hqMode, setHqMode] = useState("keepAdd"); // keepAdd | replace
  const [selectedHqNames, setSelectedHqNames] = useState([]);
  const [addHqNames, setAddHqNames] = useState([]);
  const [selectedZoneNames, setSelectedZoneNames] = useState([]);
  const [hqNameToId, setHqNameToId] = useState({});
  const [zoneNameToId, setZoneNameToId] = useState({});
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentHqNames = useMemo(
    () =>
      (employee?.assignedHeadQuarters || [])
        .map((hq) => hq.headQuarterName)
        .filter(Boolean),
    [employee],
  );

  const availableAddHqNames = useMemo(
    () =>
      Object.keys(hqNameToId).filter((name) => !currentHqNames.includes(name)),
    [hqNameToId, currentHqNames],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setOptionsLoading(true);
        if (toRole === "areaManager") {
          const data = await getAllHeadQuartersNames();
          if (cancelled) return;
          const map = (data?.headQuarterNames || []).reduce((acc, hq) => {
            acc[hq.headQuarterName] = hq._id;
            return acc;
          }, {});
          setHqNameToId(map);
        } else if (toRole === "zonalManager") {
          const data = await getZoneOptions();
          if (cancelled) return;
          const map = (data?.data || []).reduce((acc, zone) => {
            acc[zone.name] = zone._id;
            return acc;
          }, {});
          setZoneNameToId(map);
          const currentZones = (employee?.assignedZones || [])
            .map((z) => z.name)
            .filter(Boolean);
          setSelectedZoneNames(currentZones);
        }
      } catch {
        toast.error("Failed to load territory options");
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    };

    if (toRole) load();
    else setOptionsLoading(false);

    return () => {
      cancelled = true;
    };
  }, [toRole, employee?.assignedZones]);

  useEffect(() => {
    if (toRole !== "areaManager") return;
    setAddHqNames([]);
    setSelectedHqNames([]);
  }, [hqMode, toRole]);

  if (!toRole) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">Promote</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {employee?.role === "zonalManager"
              ? "Zonal Managers cannot be promoted further."
              : "This employee cannot be promoted from their current role."}
          </p>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const buildPayload = () => {
    const payload = { toRole };

    if (toRole === "areaManager") {
      if (hqMode === "replace") {
        const ids = selectedHqNames
          .map((name) => hqNameToId[name])
          .filter(Boolean);
        if (ids.length === 0) {
          toast.error("Select at least one headquarter to replace with");
          return null;
        }
        payload.assignedHeadQuarters = ids;
      } else {
        const added = addHqNames
          .map((name) => hqNameToId[name])
          .filter(Boolean);
        if (added.length > 0) {
          payload.addHeadQuarters = added;
        }
        // omit both fields = keep current HQs only
      }
    }

    if (toRole === "zonalManager") {
      const ids = selectedZoneNames
        .map((name) => zoneNameToId[name])
        .filter(Boolean);
      if (ids.length === 0) {
        toast.error("Select at least one zone");
        return null;
      }
      payload.assignedZones = ids;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    try {
      setSubmitting(true);
      const data = await promoteEmployee(employee._id, payload);
      toast.success(
        data.message ||
          `Promoted from ${roleMaper[employee.role] || employee.role} to ${roleMaper[toRole] || toRole}`,
      );
      onPromoted?.(data);
      onClose();
    } catch (err) {
      toast.error(err.message || "Promotion failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-gray-800">
              Promote Employee
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-sm">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Promotion
            </p>
            <p className="text-gray-800 font-medium">
              {roleMaper[employee.role] || employee.role}
              <span className="text-gray-400 mx-2">→</span>
              {roleMaper[toRole] || toRole}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {employee.displayName ||
                `${employee.firstName || ""} ${employee.lastName || ""}`.trim()}{" "}
              · {employee.employeeId}
            </p>
          </div>

          {toRole === "areaManager" && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Headquarters mode
                </label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHqMode("keepAdd")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm border transition-colors ${
                      hqMode === "keepAdd"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Keep &amp; add
                  </button>
                  <button
                    type="button"
                    onClick={() => setHqMode("replace")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm border transition-colors ${
                      hqMode === "replace"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Replace all
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  {hqMode === "keepAdd"
                    ? "Current HQs stay assigned. Optionally add more."
                    : "Replace the full HQ list with your selection."}
                </p>
              </div>

              {hqMode === "keepAdd" && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Headquarters
                  </label>
                  {currentHqNames.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currentHqNames.map((name) => (
                        <span
                          key={name}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">None assigned</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {hqMode === "keepAdd"
                    ? "Add Headquarters (optional)"
                    : "Assigned Headquarters"}
                </label>
                {optionsLoading ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Spinner size={16} borderWidth={2} /> Loading…
                  </div>
                ) : (
                  <Select
                    multiple
                    value={hqMode === "keepAdd" ? addHqNames : selectedHqNames}
                    onChange={(e) =>
                      hqMode === "keepAdd"
                        ? setAddHqNames(e.target.value)
                        : setSelectedHqNames(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded mt-1 text-sm bg-white"
                    sx={selectSx}
                    displayEmpty
                  >
                    {(hqMode === "keepAdd"
                      ? availableAddHqNames
                      : Object.keys(hqNameToId)
                    ).length === 0 ? (
                      <MenuItem disabled value="">
                        No headquarters available
                      </MenuItem>
                    ) : (
                      (hqMode === "keepAdd"
                        ? availableAddHqNames
                        : Object.keys(hqNameToId)
                      ).map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          sx={{
                            "&.Mui-selected": {
                              backgroundColor: "#B3D7FF !important",
                            },
                          }}
                        >
                          {name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
                <p className="mt-1.5 text-xs text-amber-700">
                  An HQ cannot be shared between Area Managers. If one is
                  already assigned elsewhere, remove it from the other AM first.
                </p>
              </div>
            </>
          )}

          {toRole === "zonalManager" && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Zones <span className="text-red-500">*</span>
              </label>
              {optionsLoading ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Spinner size={16} borderWidth={2} /> Loading…
                </div>
              ) : (
                <Select
                  multiple
                  value={selectedZoneNames}
                  onChange={(e) => setSelectedZoneNames(e.target.value)}
                  className="w-full border border-gray-300 rounded mt-1 text-sm bg-white"
                  sx={selectSx}
                  displayEmpty
                >
                  {Object.keys(zoneNameToId).length === 0 ? (
                    <MenuItem disabled value="">
                      No zones available
                    </MenuItem>
                  ) : (
                    Object.keys(zoneNameToId).map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#B3D7FF !important",
                          },
                        }}
                      >
                        {name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              )}
              <p className="mt-1.5 text-xs text-gray-500">
                All HQs in selected zones will be assigned automatically.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || optionsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && (
                <Spinner
                  size={16}
                  borderWidth={2}
                  className="border-white border-t-transparent"
                />
              )}
              {submitting ? "Promoting…" : "Confirm promote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoteEmployeeModal;
