import { Outlet } from "react-router-dom";
import MrContextProvider from "./context/MrContext";

const ContextProviderForReportetLayout = () => {
  return (
    <MrContextProvider>
      <Outlet />
    </MrContextProvider>
  );
};

export default ContextProviderForReportetLayout;
