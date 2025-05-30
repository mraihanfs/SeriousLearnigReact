import React, { useState } from "react";
import backgroundLogin from "../assets/backgroundLogin.jpg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PASSWORD, USERNAME } from "../constants/DataConstant";
import { VALIDATIONRULE } from "../constants/PropertyCss";
import DialogValidation from "../components/DialogValidation";
import { FORM_VALIDATION, VALIDATION_ERROR } from "../constants/DataInput";
import authServices from "../services/authService";
import LoadingScreen from "../components/LoadingScreen";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validationSchema/formValidation";

const backgroundStyle = {
  backgroundImage: `url(${backgroundLogin})`,
  backgroundSize: "auto", // Makes sure the image covers the entire element
  backgroundPosition: "center", // Centers the image
  height: "100vh", // Optional, for full viewport height
};

const Register = () => {
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
    resolver: yupResolver(registerSchema),
  });

  const navigate = useNavigate();

  const goToLogin = () => navigate("/");

  const regist = async (data) => {
    try {
      setIsLoading(true);
      const resp = await authServices.register(data);
      console.log("Register Successfull", resp);
      setIsLoading(false);
      setOpenDialog(true);
      setContent(resp.data.status.contents["en"]);
      setHandle(() => handleRegistSuccess);
    } catch (err) {
      console.error(
        "Register Failed",
        err.response?.data?.responseKey || err.message
      );
      setIsLoading(false);
      setOpenDialog(true);
      setContent(
        err.response.data.status
          ? err.response?.data?.status.contents["en"]
          : VALIDATION_ERROR("Register")
      );
      setHandle(() => closeDialog);
    }
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    setOpenDialog(true);
    setContent(FORM_VALIDATION("Register"));
    setHandle(() => closeDialog);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setContent({});
    setHandle(null);
  };

  const closeDialogOnSuccessRegist = () => {
    setOpenDialog(false);
    setContent({});
  };

  const handleRegistSuccess = () => {
    closeDialogOnSuccessRegist();
    setHandle(null);
    goToLogin();
  };

  return (
    <div
      style={backgroundStyle}
      className="h-screen w-screen flex flex-col items-center justify-center box-border"
    >
      {isLoading && <LoadingScreen />}
      <div className="flex justify-center items-center">
        <div className="bg-white container rounded-xl">
          <div className="mt-3 text-center text-xl">Create an Account</div>
          <p className="m-2 text-center text-l font-sans">
            Create a account to continue
          </p>
          <form
            className="grid grid-rows-auto"
            onSubmit={handleSubmit(regist, onError)}
          >
            <div className="m-3">
              <label htmlFor="email" className="block m-1 text-slate-600">
                Email address:
              </label>
              <input
                type="email"
                id="email"
                className="form-input rounded-xl w-80"
                {...register("username")}
                placeholder="esteban_schiller@gmail.com"
              />
              <p className={VALIDATIONRULE}>{errors.username?.message}</p>
            </div>
            <div className="m-3">
              <label htmlFor="name" className="block m-1 text-slate-600">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="form-input rounded-xl w-80"
                {...register("full_name")}
                placeholder="Fullname"
              />
              <p className={VALIDATIONRULE}>{errors.name?.message}</p>
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
                {...register("password")}
                placeholder="⬤ ⬤ ⬤ ⬤ ⬤ ⬤"
              />
              <p className={VALIDATIONRULE}>{errors[PASSWORD]?.message}</p>
            </div>
            <div className="m-3">
              <label
                htmlFor="confirmPassword"
                className="block m-1 text-slate-600"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name=""
                id="confirmPassword"
                className="form-input rounded-xl w-80 "
                {...register("confirmPassword")}
                placeholder="⬤ ⬤ ⬤ ⬤ ⬤ ⬤"
              />
              <p className={VALIDATIONRULE}>
                {errors.confirmPassword?.message}
              </p>
            </div>
            <div className="m-3">
              <input type="checkbox" name="tnc" id="tnc" {...register("tnc")} />
              <label htmlFor="tnc" className="inline ms-1 text-slate-600">
                I accept terms and conditions
              </label>
              <p className={VALIDATIONRULE}>{errors.tnc?.message}</p>
            </div>
            <div className="m-5 justify-self-center">
              <input
                type="submit"
                className="border border-solid p-1 rounded-md bg-blue-500 text-white w-72 h-10 hover:cursor-pointer hover:bg-blue-400 font-semibold text-sm"
                value="Sign Up"
              />
              <p className="text-xs mt-2 mb-5 text-center">
                Already have an account?
                <a
                  href="/"
                  className="text-sans ms-1 text-blue-600 hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
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

export default Register;
