import { useState, cloneElement } from "react";
import { sidebarTabs } from "./sidebarTabs";
import { ChevronRight, ChevronLeft, ChevronDown, LogOut } from "lucide-react";
import VisitReport from "./admin/VisitReport";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeTabId, setActiveTabId] = useState("visit-report");
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const renderActiveComponent = () => {
    // Flatten all tabs and sub-tabs to find the active component
    let allTabs = [];
    sidebarTabs.forEach((tab) => {
      if (tab.dropdown) {
        allTabs = allTabs.concat(tab.dropdown);
      } else {
        allTabs.push(tab);
      }
    });

    const activeTab = allTabs.find((tab) => tab.id === activeTabId);

    // Default to DoctorsList if activeTabId is not found
    if (!activeTab) {
      return <VisitReport />;
    }

    return activeTab.component;
  };

  return (
    <>
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/reportet" className="px-6 text-blue-600 font-bold text-2xl">
          Report<span className="text-black">ET</span>
        </a>
      </div>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`${collapsed ? "w-20" : "w-72"
            } transition-all duration-300 bg-white shadow-lg flex flex-col`}
        >
          {/* Logo and collapse button */}
          <div className="p-2 flex justify-between items-center bg-blue-600">
            {!collapsed && (
              <span
                className="flex items-center gap-2 text-white font-bold text-xl "
              >
                Admin
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md hover:bg-gray-200 text-white hover:text-blue-600"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation Tabs */}
          <ul className="flex-1 overflow-y-auto mt-4">
            {sidebarTabs.map((tab) => (
              <li key={tab.id} className="relative">
                {tab.dropdown ? (
                  // Dropdown Parent Tab
                  <>
                    <div
                      onClick={() => {
                        toggleDropdown(tab.id);
                        if (!tab.dropdown.some((sub) => sub.id === activeTabId)) {
                          setActiveTabId(tab.dropdown[0].id);
                        }
                      }}
                      className={`flex items-center justify-between cursor-pointer px-6 py-3 transition-colors duration-200 ${openDropdown === tab.id
                        ? "bg-gray-200 text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Always show icon */}
                        {tab.icon &&
                          cloneElement(tab.icon, {
                            className: "w-5 h-5 flex-shrink-0",
                          })}
                        {/* Show label only if NOT collapsed */}
                        {!collapsed && (
                          <span className="flex-grow">{tab.label}</span>
                        )}
                      </div>

                      {/* Show dropdown arrows only if NOT collapsed */}
                      {!collapsed && tab.dropdown && (
                        <span className="ml-2">
                          {openDropdown === tab.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {!collapsed && openDropdown === tab.id && (
                      <ul className="bg-gray-100 border-l border-gray-300 ml-4">
                        {tab.dropdown.map((subTab) => (
                          <li
                            key={subTab.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTabId(subTab.id);
                            }}
                            className={`cursor-pointer flex items-center px-6 py-3 transition-colors duration-200 ${activeTabId === subTab.id
                              ? "bg-blue-200 text-blue-800 font-semibold border-l-4 border-blue-600 -ml-1 pl-[23px]"
                              : "text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            {/* Show icon */}
                            {subTab.icon &&
                              cloneElement(subTab.icon, {
                                className: "w-4 h-4 mr-2 flex-shrink-0",
                              })}
                            <span>{subTab.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Single Tab
                  <div
                    onClick={() => setActiveTabId(tab.id)}
                    className={`cursor-pointer flex items-center px-6 py-3 transition-colors duration-200 ${activeTabId === tab.id
                      ? "bg-blue-200 text-blue-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {/* Always show icon */}
                    {tab.icon &&
                      cloneElement(tab.icon, {
                        className: `w-5 h-5 flex-shrink-0 ${!collapsed ? "mr-3" : ""
                          }`,
                      })}
                    {/* Show label only if NOT collapsed */}
                    {!collapsed && <span>{tab.label}</span>}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* User Info */}
          {/* {!collapsed && (
            <div className="p-4 mt-auto border-t bg-white">
              <div className="flex items-center space-x-3">
                <div>
                  <button className="text-sm font-semibold text-gray-900"
                  onClick={()=>{
                    localStorage.removeItem("userToken"); 
                    navigate("/reportet")

                  }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )} */}
          {/* User Info / Logout */}
          <div className="p-4 mt-auto border-t bg-white">
            <div className="flex items-center space-x-3">
              <button
                className={`flex items-center text-md font-semibold text-red-500 hover:text-red-700 transition-colors ${collapsed ? "justify-center w-full" : ""
                  }`}
                onClick={() => {
                  localStorage.removeItem("userToken");
                  navigate("/reportet");
                }}
              >
                <LogOut size={18} className="flex-shrink-0" />
                {!collapsed && <span className="ml-2">Logout</span>}
              </button>
            </div>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">{renderActiveComponent()}</div>
      </div>
    </>
  );
};

export default Sidebar;
