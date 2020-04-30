import React from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

export default function SnackBar({ open, severity, onClose, infoMsg }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === "success" ? 1000 : 4000}
      onClose={onClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
      >
        {infoMsg}
      </MuiAlert>
    </Snackbar>
  );
}

SnackBar.propTypes = {
  open: PropTypes.bool.isRequired,
  severity: PropTypes.oneOf(["error", "success", "info", "warning"]),
  onClose: PropTypes.func,
  infoMsg: PropTypes.string,
};

SnackBar.defaultProps = {
  open: false,
  severity: "info",
  onClose: () => {},
  infoMsg: "",
};
