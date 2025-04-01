import React, { useState } from "react";
import backgroundLogin from "../assets/backgroundLogin.jpg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PASSWORD, USERNAME } from "../constants/DataConstant";
import { VALIDATIONRULE } from "../constants/PropertyCss";
import DialogValidation from "../components/DialogValidation";
import { VALIDATION_ERROR_LOGIN } from "../constants/DataInput";
import authServices from "../services/authService";
import LoadingScreen from "../components/LoadingScreen";

const backgroundStyle = {
  backgroundImage: `url(${backgroundLogin})`,
  backgroundSize: "auto", // Makes sure the image covers the entire element
  backgroundPosition: "center", // Centers the image
  height: "100vh", // Optional, for full viewport height
};

const Login = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [content, setContent] = useState({});
  const [handle, setHandle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const navigate = useNavigate();

  const goToDashboard = () => navigate("/home");

  const login = async (data) => {
    try {
      setIsLoading(true);
      const resp = await authServices.login(data);
      console.log("Login Successfull", resp);
      setIsLoading(false);
      setOpenDialog(true);
      setContent(resp.data.status.contents["en"]);
      setHandle(() => handleLoginSuccess);
    } catch (err) {
      console.error(
        "Login Failed",
        err.response?.data?.responseKey || err.message
      );
      setIsLoading(false);
      setOpenDialog(true);
      setContent(
        err.response?.data?.status.contents["en"] || VALIDATION_ERROR_LOGIN
      );
      setHandle(() => closeDialog);
    }
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    setOpenDialog(true);
    setContent(VALIDATION_ERROR_LOGIN);
    setHandle(() => closeDialog);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setContent({});
    setHandle(null);
  };

  const closeDialogOnSuccessLogin = () => {
    setOpenDialog(false);
    setContent({});
  };

  const handleLoginSuccess = () => {
    closeDialogOnSuccessLogin();
    setHandle(null);
    goToDashboard();
  };
  // console.log(isHaveKeyObject(errors));
  // if (isHaveKeyObject(errors)) {
  //   setOpenDialog(!openDialog)
  // }
  // useEffect(() => {
  //   console.log("✅ Dialog state updated:", openDialog);
  // }, [openDialog]); // Runs when `openDialog` changes

  return (
    <div
      style={backgroundStyle}
      className="h-screen w-screen flex flex-col items-center justify-center box-border"
    >
      {isLoading && <LoadingScreen />}
      <div className="flex justify-center items-center">
        <div className="bg-white container rounded-xl">
          <div className="m-3 text-justify text-xl">Sign in</div>
          <form
            className="grid grid-rows-auto"
            onSubmit={handleSubmit(login, onError)}
          >
            <div className="m-3">
              <label htmlFor="username" className="block m-1 text-slate-600">
                Email or phone number
              </label>
              <input
                type="text"
                id={USERNAME}
                className="form-input rounded-xl w-80"
                {...register(USERNAME, {
                  required: `Please fill in the ${USERNAME}`,
                })}
              />
              <p className={VALIDATIONRULE}>{errors[USERNAME]?.message}</p>
            </div>
            <div className="m-3">
              <label htmlFor="password" className="block m-1 text-slate-600">
                Password
              </label>
              <input
                type="password"
                name=""
                id={PASSWORD}
                className="form-input rounded-xl w-80 "
                {...register(PASSWORD, {
                  required: `Please fill in the ${PASSWORD}`,
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <p className={VALIDATIONRULE}>{errors[PASSWORD]?.message}</p>
              <div className="mt-5 justify-self-center">
                <input
                  type="submit"
                  className="border border-solid p-1 rounded-full bg-slate-600 text-white w-80 h-12 hover:cursor-pointer hover:bg-slate-300 hover:text-black"
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
                className="text-black hover:text-slate-600 text-sans underline underline-offset-[5px] ms-1"
              >
                Sign Up
              </a>
            </article>
          </form>
        </div>
      </div>

      <DialogValidation
        open={openDialog}
        content={content}
        handleButton={handle}
      />
    </div>
  );
};

export default Login;
