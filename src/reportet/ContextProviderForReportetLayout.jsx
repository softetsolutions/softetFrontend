import { Outlet } from "react-router-dom";
import MrContextProvider from "./context/MrContext";
import { OrganizationProvider } from "./context/OrganizationContext";

const ContextProviderForReportetLayout = () => {
  return (
    <OrganizationProvider>
      <MrContextProvider>
        <Outlet />
      </MrContextProvider>
    </OrganizationProvider>
  );
};

export default ContextProviderForReportetLayout;
