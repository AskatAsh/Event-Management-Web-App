import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoURL = e.target.photoUrl.value;

    const userInfo = { name, email, password, photoURL };
    console.log(userInfo);

    setErrorMessage("");
    setSuccess("");

    // password validation
    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    } else if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*/.test(password)) {
      setErrorMessage(
        "Password must contain at least an uppercase letter and a special character."
      );
      return;
    }

    // register user
    const result = await fetch(
      "https://event-management-backend-cw35.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    ).then((res) => res.json());

    // registration error and success message
    if (!result?.success) {
      toast.error(result?.message || "User already exists or invalid inputs.", {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
        theme: "dark",
      });
    } else {
      toast.success(result?.message || "User registered successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
        theme: "dark",
      });
      e.target.reset();
      navigate("/login");
    }

    console.log(result);
  };

  return (
    <div>
      <title>EventZ | Register</title>
      <div className="hero py-14">
        <div className="hero-content flex-col max-w-md w-full">
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-5xl font-bold">Register now!</h1>
            <p>Register now and join best events of your life.</p>
          </div>
          <div className="card w-full shadow-2xl bg-[#1F2937]">
            <form className="card-body" onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <label className="label" htmlFor="name">
                  <span className="label-text">Username</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="your name"
                  className="input input-bordered input_styles"
                  required
                />
              </fieldset>
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
              <fieldset className="fieldset">
                <label className="label" htmlFor="photoUrl">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="photoUrl"
                  type="url"
                  name="photoUrl"
                  placeholder="Photo URL"
                  className="input input-bordered input_styles"
                  required
                />
              </fieldset>
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
              <div>
                {errorMessage ? (
                  <span className="text-xs text-red-400">{errorMessage}</span>
                ) : (
                  <span className="text-xs text-green-400">{success}</span>
                )}
              </div>
              <div className="form-control mt-4">
                <button className="btn btn-warning opacity-90 text-black w-full">
                  Register
                </button>
              </div>
              <p className="text-xs py-2 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 underline underline-offset-2"
                >
                  Login Here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
