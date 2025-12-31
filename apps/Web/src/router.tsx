// router.ts
import { createBrowserRouter } from "react-router-dom";
import App from "./App"; // Import your App layout
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import HomeScreen from "./pages/HomeScreen";
import Dashboard from "./pages/Dashbaord/Dashboard";
import Employees from "./pages/Dashbaord/Employees/Employees";
import Visitors from "./pages/Dashbaord/Visitors/Visitors";
import Visits from "./pages/Dashbaord/Visits/Visits";
import Records from "./pages/Dashbaord/Records/Records";
import Deliveries from "./pages/Dashbaord/Deliveries/Deliveries";
import Meetings from "./pages/Dashbaord/Meetings/Meetings";
import Departments from "./pages/Dashbaord/Departments/Departments";
// import Projects from "./pages/Dashbaord/Projects/Projects";
import DashboardLayout from "./components/layout/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App contains the <Outlet />
    children: [
      {
        path: "/", // Index route (Home)
        element: <HomeScreen />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "employees",
            element: <Employees />,
          },
          {
            path: "visitors",
            element: <Visitors />,
          },
          {
            path: "visits",
            element: <Visits />,
          },
          {
            path: "records",
            element: <Records />,
          },
          {
            path: "deliveries",
            element: <Deliveries />,
          },
          {
            path: "meetings",
            element: <Meetings />,
          },
          {
            path: "departments",
            element: <Departments />,
          },
          // {
          //   path: "projects",
          //   element: <Projects />,
          // },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
    ],
  },
]);
