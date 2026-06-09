import AddAreaOrDoctor from "./admin/AddDoctorOrArea";
import StockistMaster from "./admin/StockistMaster";
import CreateEmployee from "./admin/CreateEmployee";
import DoctorsList from "./admin/DoctorList";
import VisitReport from "./admin/VisitReport";
import HierarchyForm from "./admin/HierarchyForm";
import HeadQuarterListing from "./admin/HeadQuarterListing";
import CreateStockist from "./admin/CreateStockist";
import EmployeeList from "./admin/EmployeeList";
import AreaList from "./admin/AreaList";
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
} from "lucide-react";

export const sidebarTabs = [
  {
    id: "visit-report",
    label: "Visit Report",
    icon: <ClipboardList size={18} />,
    component: <VisitReport />,
  },
  {
    id: "stockist-master",
    label: "Stockist",
    icon: <Package size={18} />,
    dropdown: [
      {
        id: "stockist-master",
        label: "Stockist Master",
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
];
