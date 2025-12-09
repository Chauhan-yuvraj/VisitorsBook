import { TabName } from "@/app/(admin)/Sidebar";
import EmployeesList from "@/components/dashboard/Employees/EmployeesList";
import VisitorsList from "@/components/dashboard/Visitors/VisitorsList";
import MainDashBoard from "@/components/dashboard/MainDashBoard";
import { Text, View } from "react-native";

export default function DashboardContent({
  tab,
  navigate,
}: {
  tab: TabName;
  navigate: (tab: TabName) => void;
}) {
  switch (tab) {
    case "Dashboard":
      return <MainDashBoard />;

    case "Employees":
      // We don't need to pass navigate for the form anymore, 
      // the form will be handled internally by this component.
      return <EmployeesList />;

    case "Visitors":
      return <VisitorsList />;

    case "Invites":
      return <View><Text>Invites Component</Text></View>;

    case "Analytics":
      return <View><Text>Analytics Component</Text></View>;

    default:
      return <MainDashBoard />;
  }
}