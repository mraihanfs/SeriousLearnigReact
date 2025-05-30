import React, { useState } from "react";
import backgroundLogin from "../assets/backgroundLogin.jpg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PASSWORD, USERNAME } from "../constants/DataConstant";
import { VALIDATIONRULE } from "../constants/PropertyCss";
import DialogValidation from "../components/DialogValidation";
import { VALIDATION_ERROR, FORM_VALIDATION } from "../constants/DataInput";
import authServices from "../services/authService";
import LoadingScreen from "../components/LoadingScreen";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const backgroundStyle = {
  backgroundImage: `url(${backgroundLogin})`,
  backgroundSize: "auto", // Makes sure the image covers the entire element
  backgroundPosition: "center", // Centers the image
  height: "100vh", // Optional, for full viewport height
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please fill with email format")
    .required("Please fill in the email"),
});

const ForgotPassword = () => {
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
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const goToDashboard = () => navigate("/home");

  const forgetPassword = async (data) => {
    try {
      setIsLoading(true);
      const resp = await authServices.forgetPassword(data);
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
        err.response.data.status
          ? err.response?.data?.status.contents["en"]
          : VALIDATION_ERROR("Forgot Password")
      );
      setHandle(() => closeDialog);
    }
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    setOpenDialog(true);
    setContent(FORM_VALIDATION("Forgot Password"));
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

  return (
    <div
      style={backgroundStyle}
      className="h-screen w-screen flex flex-col items-center justify-center box-border"
    >
      {isLoading && <LoadingScreen />}
      <div className="flex justify-center items-center w-fit">
        <div className="bg-white container rounded-xl">
          <div className="mb-2 mt-10 text-center text-xl font-semibold">
            Forget Password
          </div>
          <p className="text-center text-xs px-7">
            Please enter your email form forget password and check your email
          </p>
          <form
            className="grid grid-rows-auto"
            onSubmit={handleSubmit(forgetPassword, onError)}
          >
            <div className="justify-self-center mt-3">
              <label htmlFor="email" className="block m-1 text-sm">
                Email address:
              </label>
              <input
                type="text"
                id="email"
                placeholder="esteban_schiller@gmail.com"
                className="form-input rounded-md w-[22rem] bg-slate-200 mt-1"
                {...register("email")}
              />
              <p className={VALIDATIONRULE}>{errors.email?.message}</p>
            </div>
            <div className="mt-5 justify-self-center">
              <input
                type="submit"
                className="border border-solid p-1 rounded-md bg-blue-500 text-white w-64 h-10 hover:cursor-pointer hover:bg-blue-400 font-semibold text-sm"
                value="Send"
              />
            </div>
            <article className="mx-3 mt-1 mb-10 justify-self-center text-xs">
              Remember your password?
              <a
                href="/"
                className="text-sans ms-1 text-blue-600 hover:underline"
              >
                Login
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

export default ForgotPassword;
