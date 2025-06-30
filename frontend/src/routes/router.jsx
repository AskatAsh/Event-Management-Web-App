import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AddEvent from "../pages/AddEvent";
import AllEvents from "../pages/AllEvents";
import ContactUs from "../pages/ContactUs";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyEvents from "../pages/MyEvents";
import Register from "../pages/Register";
import UpdateEvent from "../pages/UpdateEvent";
import AboutUs from "./../pages/AboutUs";
import PrivateRoute from "./PrivateRoute";

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
        path: "/contactUs",
        Component: ContactUs,
      },
      {
        path: "/aboutUs",
        Component: AboutUs,
      },
      {
        path: "/events",
        element: (
          <PrivateRoute>
            <AllEvents />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-event",
        element: (
          <PrivateRoute>
            <AddEvent />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-event/:eventId",
        element: (
          <PrivateRoute>
            <UpdateEvent />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-events",
        element: (
          <PrivateRoute>
            <MyEvents />
          </PrivateRoute>
        ),
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
