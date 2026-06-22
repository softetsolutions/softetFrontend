import { useContext } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import { MrContext } from "../reportet/context/MrContext";

function MrDialogBox({ open, close, mr }) {
  const { setEditMr } = useContext(MrContext);

  const handleEdit = () => {
    setEditMr(mr);
    close();
    window.dispatchEvent(
      new CustomEvent("switch-tab", { detail: "create-user" })
    );
  };

  if (!open || !mr) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative bg-white px-5 py-5 rounded-xl w-90">
        <button
          onClick={close}
          className="absolute right-4 top-3 bg-transparent text-red-700 border border-red-700 text-sm rounded-full cursor-pointer"
        >
          <CloseIcon />
        </button>

        <h1 className="text-center font-semibold mb-3 text-2xl">MR Details</h1>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="font-semibold">Name</span>
            <span>
              {mr?.firstName} {mr?.lastName}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Username</span>
            <span>{mr?.userName}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Email</span>
            <span>{mr?.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Password</span>
            <div className="flex items-center">
              <span className="text-gray-800 text-sm">******</span>
              <Tooltip title={`Password: ${mr?.password}`} arrow>
                <InfoIcon className="cursor-pointer scale-75" />
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={handleEdit}
            className="bg-[#155DFC] text-white px-3 py-1 rounded-sm cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default MrDialogBox;
