import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (user && user?.email) {
    return children;
  }

  return <Navigate to="/login"></Navigate>;
};

export default PrivateRoute;
