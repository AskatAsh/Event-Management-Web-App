import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AllEvents from "../pages/AllEvents";
import Home from "../pages/Home";

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
    ],
  },
]);

export default router;
