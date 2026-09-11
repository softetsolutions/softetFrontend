import { lazy } from "react";
import {
  ClipboardList,
  Package,
  UserPlus,
  Users,
  List,
  MapPin,
  Map,
  UserCheck,
  Store,
  BadgeDollarSign,
  Parasol,
  LayoutDashboard,
  Settings2,
} from "lucide-react";

const Dashboard = lazy(() => import("./admin/Dashboard"));
const VisitReport = lazy(() => import("./admin/VisitReport"));
const SalesReport = lazy(() => import("./admin/SalesReport"));
const DoctorVisitReport = lazy(() => import("./admin/DoctorVisit"));
const CallAverageReport = lazy(() => import("./admin/CallAverageReport"));
const LeaveReport = lazy(() => import("./admin/LeaveReport"));
const StockistMaster = lazy(() => import("./admin/StockistMaster"));
const CreateStockist = lazy(() => import("./admin/CreateStockist"));
const CreateSale = lazy(() => import("./admin/Sale"));
const CreateEmployee = lazy(() => import("./admin/CreateEmployee"));
const EmployeeList = lazy(() => import("./admin/EmployeeList"));
const EmployeeDetail = lazy(() => import("./admin/EmployeeProfile"));
const AddAreaOrDoctor = lazy(() => import("./admin/AddDoctorOrArea"));
const AreaList = lazy(() => import("./admin/AreaList"));
const DoctorsList = lazy(() => import("./admin/DoctorList"));
const HierarchyForm = lazy(() => import("./admin/HierarchyForm"));
const HeadQuarterListing = lazy(() => import("./admin/HeadQuarterListing"));
const AdminLeaves = lazy(() => import("./admin/AdminLeaves"));
const LeaveSettings = lazy(() => import("./admin/LeaveSettings"));

export const sidebarTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    Component: Dashboard,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <ClipboardList size={18} />,
    dropdown: [
      {
        id: "visit-report",
        label: "Visit Report",
        icon: <ClipboardList size={18} />,
        Component: VisitReport,
      },
      {
        id: "sales-report",
        label: "Sales Report",
        icon: <BadgeDollarSign size={18} />,
        Component: SalesReport,
      },
      {
        id: "doctor-visit-report",
        label: "Doctor Visit Report",
        icon: <BadgeDollarSign size={18} />,
        Component: DoctorVisitReport,
      },
      {
        id: "call-visit-report",
        label: "Call Average Report",
        icon: <BadgeDollarSign size={18} />,
        Component: CallAverageReport,
      },
      {
        id: "leave-report",
        label: "Leave Report",
        icon: <Parasol size={18} />,
        Component: LeaveReport,
      },
    ],
  },
  {
    id: "stockist-master",
    label: "Stockist",
    icon: <Package size={18} />,
    dropdown: [
      {
        id: "stockist-master",
        label: "Stockist List",
        icon: <Store size={18} />,
        Component: StockistMaster,
      },
      {
        id: "create-stockist",
        label: "Create Stockist",
        icon: <ClipboardList size={18} />,
        Component: CreateStockist,
      },
      {
        id: "create-sales",
        label: "Create Sale",
        icon: <ClipboardList size={18} />,
        Component: CreateSale,
      },
    ],
  },
  {
    id: "mr",
    label: "Employee",
    icon: <Users size={20} />,
    dropdown: [
      {
        id: "create-user",
        label: "Onboard New",
        icon: <UserPlus size={20} />,
        Component: CreateEmployee,
      },
      {
        id: "mr-list",
        label: "Employee List",
        icon: <UserPlus size={20} />,
        Component: EmployeeList,
      },
      {
        id: "profile",
        label: "Profile",
        icon: <UserPlus size={20} />,
        Component: EmployeeDetail,
      },
    ],
  },
  {
    id: "area-doctor",
    label: "Doctor/Area",
    icon: <Users size={20} />,
    dropdown: [
      {
        id: "add",
        label: "Add",
        icon: <UserPlus size={18} />,
        Component: AddAreaOrDoctor,
      },
      {
        id: "area-list",
        label: "Area List",
        icon: <UserCheck size={18} />,
        Component: AreaList,
      },
      {
        id: "doctors-list",
        label: "Doctors List",
        icon: <List size={18} />,
        Component: DoctorsList,
      },
    ],
  },
  {
    id: "headquarter-master",
    label: "Headquarter Master",
    icon: <MapPin size={18} />,
    dropdown: [
      {
        id: "add-headquarter",
        label: "Add Headquarter",
        icon: <Map size={18} />,
        Component: HierarchyForm,
      },
      {
        id: "list-headquarter",
        label: "Headquarter List",
        icon: <UserCheck size={18} />,
        Component: HeadQuarterListing,
      },
    ],
  },
  {
    id: "leave-management",
    label: "Leave Management",
    icon: <Parasol size={18} />,
    dropdown: [
      {
        id: "leaves",
        label: "Leaves",
        icon: <Map size={18} />,
        Component: AdminLeaves,
      },
      {
        id: "leave-settings",
        label: "Leave Settings",
        icon: <Settings2 size={18} />,
        Component: LeaveSettings,
      },
    ],
  },
];
