import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div>
      <h1 className="text-5xl text-amber-400">
        Welcome to Event Management App
      </h1>
      <Outlet />
    </div>
  );
};

export default MainLayout;
