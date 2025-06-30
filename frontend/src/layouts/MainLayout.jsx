import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Footer from "../components/shared/Footer";
import Header from "../components/shared/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="container my-10">
        <Outlet />
      </div>
      <Footer />

      <ToastContainer />
    </>
  );
};

export default MainLayout;
