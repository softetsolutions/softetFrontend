import AddDoctor from "./admin/AddDoctor";
import StockistMaster from "./admin/StockistMaster";
import CreateUser from "./admin/CreateUser";
import DoctorsList from "./admin/DoctorList";
import VisitReport from "./admin/VisitReport";
import HierarchyForm from "./admin/HierarchyForm";
import HeadQuarterListing from "./admin/HeadQuarterListing";
import CreateStockist from "./admin/CreateStockist";
import AssignDoctor from "./admin/AssignDoctor";
import AllMR from "./admin/AllMR";
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
    label: "MR",
    icon: <Users size={20} />,
    dropdown: [
      {
        id: "create-user",
        label: "Create MR",
        icon: <UserPlus size={20} />,
        component: <CreateUser />,
      },
      {
        id: "mr-list",
        label: "MR List",
        icon: <UserPlus size={20} />,
        component: <AllMR />,
      },
    ],
  },
  {
    id: "doctors",
    label: "Doctor",
    icon: <Users size={20} />,
    dropdown: [
      {
        id: "doctors-list",
        label: "Doctors List",
        icon: <List size={18} />,
        component: <DoctorsList />,
      },
      {
        id: "add-doctor",
        label: "Add Doctor",
        icon: <UserPlus size={18} />,
        component: <AddDoctor />,
      },
      {
        id: "assign-doctor",
        label: "Assign Doctor",
        icon: <UserCheck size={18} />,
        component: <AssignDoctor />,
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
