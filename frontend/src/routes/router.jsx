import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AllEvents from "../pages/AllEvents";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "/",
        Component: Home,
        index: true,
      },
      {
        path: "/events",
        Component: AllEvents,
        loader: async () => {
          const events = await fetch(
            "https://event-management-backend-cw35.onrender.com/events"
          ).then((res) => res.json());
          return { events };
        },
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
    ],
  },
]);

export default router;
