import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const DialogValidation = ({ open, content, handleButton }) => {
  

  return (
    <>
      <Dialog open={open} onClose={handleButton}>
        <DialogTitle>{content.title}</DialogTitle>
        <DialogContent>{content.description}</DialogContent>
        <DialogActions>
          <Button onClick={handleButton}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogValidation;
