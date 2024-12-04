import React, { useState } from "react";
import backgroundLogin from "../assets/backgroundLogin.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

const backgroundStyle = {
  backgroundImage: `url(${backgroundLogin})`,
  backgroundSize: "auto", // Makes sure the image covers the entire element
  backgroundPosition: "center", // Centers the image
  height: "100vh", // Optional, for full viewport height
};

const Login = () => {
  const [isHidePass, setIsHidePass] = useState(true);

  const navigate = useNavigate();

  const goToDashboard = () => navigate('/home')

  return (
    <div
      style={backgroundStyle}
      className="h-screen w-screen flex flex-col items-center justify-center box-border"
    >
      <div className="flex justify-center items-center">
        <div className="bg-white container rounded-xl">
          <div className="m-3 text-justify text-xl">Sign in</div>
          <form action="" className="grid grid-rows-auto" onSubmit={goToDashboard}>
            <div className="m-3">
              <label htmlFor="username" className="block m-1 text-slate-600">
                Email or phone number
              </label>
              <input
                type="text"
                id="username"
                className="form-input rounded-xl w-80"
              />
            </div>
            <div className="m-3">
              <label htmlFor="password" className="block m-1 text-slate-600">
                Password
              </label>
              <input
                type="password"
                name=""
                id="password"
                className="form-input rounded-xl w-80 "
              />
              <div className="mt-5 justify-self-center">
                <input
                  type="submit"
                  className="border border-solid p-1 rounded-full bg-slate-600 text-white w-80 h-12"
                  value="Sign in"
                />
              </div>
              <div className="mt-5 mx-3 flex items-center justify-between">
                <div>
                  <input
                    type="checkbox"
                    className="form-checkbox border border-solid p-1 text-black"
                    id="remeber"
                  />
                  <label htmlFor="remeber" className="m-1">
                    Remember Me
                  </label>
                </div>
                <a
                  href="http://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-right basis-1/2 text-black hover:text-slate-600 text-sans underline underline-offset-4" 
                >
                  Need help?
                </a>
              </div>
            </div>
            <article className="mx-3 my-5 justify-self-start">
              Don't have an account?
              <a
                href="http://"
                className="text-black hover:text-slate-600 text-sans underline underline-offset-4 ms-1"
              >
                Sign Up
              </a>
            </article>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
