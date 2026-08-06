import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getMyOrganization } from "../api/profile";

const OrganizationContext = createContext(null);

export function OrganizationProvider({ children }) {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshOrganization = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyOrganization();
      setOrganization(res.data);
    } catch (err) {
      console.error("Failed to load organization", err);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOrganization = useCallback(() => {
    setOrganization(null);
  }, []);

  useEffect(() => {
    refreshOrganization();
  }, [refreshOrganization]);

  return (
    <OrganizationContext.Provider
      value={{ organization, loading, refreshOrganization, clearOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider",
    );
  }
  return ctx;
}
