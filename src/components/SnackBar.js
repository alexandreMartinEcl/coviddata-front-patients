import React from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import { connect } from 'react-redux'
import { clearSnackbar } from '../store/actions'

const SnackBar = ({
  open,
  severity,
  onClose,
  infoMsg
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === "success" ? 4000 : 4000}
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

const mapStateToProps = state => ({
  open: state.uiReducer.snackbarOpen,
  severity: state.uiReducer.snackbarSeverity,
  infoMsg: state.uiReducer.snackbarMessage,
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(clearSnackbar())
})

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar)