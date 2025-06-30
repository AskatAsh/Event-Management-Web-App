import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router";
import { Bounce, toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const userInfo = { email, password };
    console.log(userInfo);

    // login user
    const result = await fetch(
      "https://event-management-backend-cw35.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    ).then((res) => res.json());

    // login error and success message
    if (!result?.success) {
      toast.error(result?.message || "No user exits or invalid inputs.", {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
        theme: "dark",
      });
    } else {
      toast.success(result?.message || "User Logged in successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
        theme: "dark",
      });

      localStorage.setItem("user", JSON.stringify(result?.user));
      setUser(result?.user);
    }

    console.log(result);
  };
  return (
    <div>
      <title>EventZ | Register</title>
      <div className="hero py-14">
        <div className="hero-content flex-col max-w-md w-full">
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-5xl font-bold">Welcome Back!</h1>
            <p>Login now and join best events of your life.</p>
          </div>
          <div className="card w-full shadow-2xl bg-[#1F2937]">
            <form className="card-body" onSubmit={handleRegister}>
              {/* user email */}
              <fieldset className="fieldset">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="email"
                  className="input input-bordered input_styles"
                  required
                />
              </fieldset>
              {/* user password */}
              <fieldset className="fieldset">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>

                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    placeholder="password"
                    className="input input-bordered input_styles"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <span
                    className="absolute right-2 z-50 text-lg"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <FaRegEye></FaRegEye>
                    ) : (
                      <FaRegEyeSlash></FaRegEyeSlash>
                    )}
                  </span>
                </div>
              </fieldset>
              <div className="form-control mt-4">
                <button className="btn btn-warning opacity-90 text-black w-full">
                  Login
                </button>
              </div>
              <p className="text-xs py-2 text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-400 underline underline-offset-2"
                >
                  Register Here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
