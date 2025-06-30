import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (user && user?.email) {
    return children;
  }

  return <Navigate to="/login"></Navigate>;
};

export default PrivateRoute;
