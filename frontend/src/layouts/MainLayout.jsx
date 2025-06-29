import { Outlet } from "react-router";
import Header from "../components/shared/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-5xl text-amber-400">
          Welcome to Event Management App
        </h1>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
