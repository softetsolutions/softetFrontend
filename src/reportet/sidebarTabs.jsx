import AddDoctor from "./admin/AddDoctor";
import StockistMaster from "./admin/StockistMaster";
import CreateUser from "./admin/CreateUser";
import DoctorsList from "./admin/DoctorList";
import VisitReport from "./admin/VisitReport";
import AreaMaster from "./admin/AreaMaster";
import AssignArea from "./admin/AssignArea";
import CreateStockist from "./admin/CreateStockist";
import AssignDoctor from "./admin/AssignDoctor";
import {
  ClipboardList,
  Package,
  UserPlus,
  Users,
  List,
  MapPin,
  Map ,
  UserCheck,
  Store 

} from "lucide-react";


export const sidebarTabs = [
  { id: "visit-report",
    label: "Visit Report",
    icon: <ClipboardList size={18} />,
    component:<VisitReport/>
  },
  { id: "stockist-master", label: "Stockist",icon: <Package size={18} />,
  dropdown:[
    {id:"stockist-master", label: "Stockist Master", icon:<Store size={18}/>,component: <StockistMaster />},
    {id:"create-stockist", label: "Create Stockist", icon:<ClipboardList size={18}/>,component: <CreateStockist />},
  ]
  
   },
  { id: "create-user", label: "Create MR",icon: <UserPlus size={20} />, component: <CreateUser /> },
  { 
    id: "doctors", 
    label: "Doctor", 
    icon: <Users size={20} />,
    dropdown: [
      { id: "doctors-list", label: "Doctors List",icon: <List size={18} />, component: <DoctorsList /> },
      { id: "add-doctor", label: "Add Doctor",icon: <UserPlus size={18} />, component: <AddDoctor/> },
      { id: "assign-doctor", label: "Assign Doctor",icon: <UserCheck size={18} />, component: <AssignDoctor/> },
    ]
  },
  {
    id:"area-master", label:"Area Master", icon:<MapPin size={18}/> ,
    dropdown:[
      {id:"add-area", label:"Add Area",icon: <Map size={18} />,component:<AreaMaster/> },
      {id:"assign-area", label:"Assign Area",icon: <UserCheck size={18} />,component:<AssignArea/> },

    ] 
  }
];
