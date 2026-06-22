import AddAreaOrDoctor from "./admin/AddDoctorOrArea";
import StockistMaster from "./admin/StockistMaster";
import CreateEmployee from "./admin/CreateEmployee";
import DoctorsList from "./admin/DoctorList";
import VisitReport from "./admin/VisitReport";
import HierarchyForm from "./admin/HierarchyForm";
import HeadQuarterListing from "./admin/HeadQuarterListing";
import CreateStockist from "./admin/CreateStockist";
import EmployeeList from "./admin/EmployeeList";
import EmployeeDetail from "./admin/EmployeeProfile";
import AreaList from "./admin/AreaList";
import AdminLeaves from "./admin/AdminLeaves";
import SalesReport from "./admin/SalesReport";
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
} from "lucide-react";

export const sidebarTabs = [
  {
    id: "reports",
    label: "Reports",
    icon: <ClipboardList size={18} />,

    dropdown: [
      {
        id: "visit-report",
        label: "Visit Report",
        icon: <ClipboardList size={18} />,
        component: <VisitReport />,
      },
      {
        id: "sales-report",
        label: "Sales Report",
        icon: <BadgeDollarSign size={18} />,
        component: <SalesReport />,
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
        component: <StockistMaster />,
      },
      {
        id: "create-stockist",
        label: "Create Stockist",
        icon: <ClipboardList size={18} />,
        component: <CreateStockist />,
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
        component: <CreateEmployee />,
      },
      {
        id: "mr-list",
        label: "Employee List",
        icon: <UserPlus size={20} />,
        component: <EmployeeList />,
      },
      {
        id: "profile",
        label: "Profile",
        icon: <UserPlus size={20} />,
        component: <EmployeeDetail key="employee-detail" />,
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
        component: <AddAreaOrDoctor />,
      },
      {
        id: "area-list",
        label: "Area List",
        icon: <UserCheck size={18} />,
        component: <AreaList />,
      },
      {
        id: "doctors-list",
        label: "Doctors List",
        icon: <List size={18} />,
        component: <DoctorsList />,
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
        component: <HierarchyForm />,
      },
      {
        id: "list-headquarter",
        label: "Headquarter List",
        icon: <UserCheck size={18} />,
        component: <HeadQuarterListing />,
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
        component: <AdminLeaves />,
      },
    ],
  },
];
