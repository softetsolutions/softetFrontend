import { createContext, useState } from "react";

export const MrContext = createContext();

function MrContextProvider({ children }) {
  const [editMr, setEditMr] = useState(null);

  return (
    <MrContext.Provider value={{ editMr, setEditMr }}>
      {children}
    </MrContext.Provider>
  );
}

export default MrContextProvider;
