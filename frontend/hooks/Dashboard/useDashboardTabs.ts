import { TabName } from "@/app/(admin)/Sidebar";
import { useState, useCallback } from "react";

export function useDashboardTabs(defaultTab: TabName = "Dashboard") {
  const [currentTab, setCurrentTab] = useState<TabName>(defaultTab);

  const navigate = useCallback((tab: TabName) => {
    setCurrentTab(tab);
  }, []);

  return { currentTab, navigate };
}
