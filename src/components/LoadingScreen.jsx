import React from "react";
import { CircularProgress } from "@mui/material";


const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-[1600]">
      <CircularProgress size={100} />
    </div>
  );
};

export default LoadingScreen;
