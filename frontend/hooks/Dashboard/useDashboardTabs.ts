import { TabName } from "@/components/dashboard/sidebar/Sidebar";
import { useState, useCallback } from "react";

export function useDashboardTabs(defaultTab: TabName = "Dashboard") {
  const [currentTab, setCurrentTab] = useState<TabName>(defaultTab);

  const navigate = useCallback((tab: TabName) => {
    setCurrentTab(tab);
  }, []);

  return { currentTab, navigate };
}
