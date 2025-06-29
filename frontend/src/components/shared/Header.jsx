import { Link, NavLink } from "react-router";
import { logo } from "../../constants";

const Header = () => {
  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/events">All Events</NavLink>
      </li>
      {/* <li><NavLink to="/contact">Contact Us</NavLink></li>
        {
            user && <>
                <li><NavLink to="/eventprogress">Event Progress</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
            </>
        } */}
    </>
  );
  return (
    <header className="navbar container">
      <div className="navbar-start">
        <div className="dropdown z-50">
          <label tabIndex={0} className="btn btn-ghost lg:hidden px-0">
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
            <li>
              <Link
                to="/register"
                className="py-2 bg-gray-900 flex items-center justify-center hover:text-yellow-400"
              >
                Register
              </Link>
            </li>
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
        <Link
          to="/register"
          className="btn bg-yellow-500 text-black hidden md:flex"
        >
          Register
        </Link>
      </div>
      {/* <ToastContainer></ToastContainer> */}
    </header>
  );
};

export default Header;
