import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router";
import { logo } from "../../constants";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/about">About Us</NavLink>
      </li>
      <li>
        <NavLink to="/contact">Contact Us</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/events">All Events</NavLink>
          </li>
          <li>
            <NavLink to="/add-events">Add Events</NavLink>
          </li>
          <li>
            <NavLink to="/my-events">Add Events</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <header className="navbar container md:px-0">
      <div className="navbar-start">
        <div className="dropdown z-50">
          <label
            tabIndex={0}
            className="btn btn-ghost lg:hidden pl-0 pr-2 sm:pr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-800 space-y-2 rounded-box w-52"
          >
            {navLinks}

            {!user && (
              <li>
                <Link
                  to="/register"
                  className="btn py-2 flex items-center justify-center hover:text-yellow-400"
                >
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Link to={"/"} className="text-2xl logo flex items-center">
          <img className="w-10" src={logo} alt="eventz logo" />
          EventZ
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
      <div className="navbar-end gap-2">
        <div>
          {user && user?.email ? (
            <div className="dropdown z-50">
              <div className="flex items-center" tabIndex={0}>
                {user.photoURL ? (
                  <div className="w-[40px] rounded-full overflow-hidden mr-1">
                    <img src={user.photoURL} alt={<FaUserCircle />} />
                  </div>
                ) : (
                  <FaUserCircle className="text-3xl mr-2"></FaUserCircle>
                )}
              </div>
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-800 space-y-2 rounded-box w-52 right-0">
                <li className="text-center py-2 font-bold">{user?.name}</li>
                <button
                  onClick={handleLogOut}
                  className="btn btn-warning btn-outline"
                >
                  Logout
                </button>
              </ul>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn btn-warning btn-outline">Login</button>
            </Link>
          )}
        </div>
      </div>
      {/* <ToastContainer></ToastContainer> */}
    </header>
  );
};

export default Header;
