import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Header from "../components/shared/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>

      <ToastContainer />
    </>
  );
};

export default MainLayout;
