import React from "react";
import { CircularProgress } from "@mui/material";

const LoadingSection = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <CircularProgress size={70} />
    </div>
  );
};

export default LoadingSection;
