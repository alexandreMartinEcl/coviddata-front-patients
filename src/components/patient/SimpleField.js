import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../../config";

import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MenuItem } from "@material-ui/core";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({}));

export default function SimpleField({
  patientId,
  title,
  data = {},
  field,
  values = [],
  dataInterface = {},
  reFetch,
  readOnly,
}) {
  const classes = useStyles();
  const [currentValue, setCurrentValue] = React.useState(data[field]);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(false);
  const [infoMsg, setInfoMsg] = React.useState("");

  const uiInform = (msg, isInfoElseError) => {
    setInfoMsg(msg);
    setSnackbarSeverity(isInfoElseError ? "success" : "error");
    setSnackbarOpen(true);
  };

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
    setInfoMsg("");
  };

  const onChange = (event) => {
    console.log(event.target.value);
    submit(event.target.value);
  };

  const submit = (value) => {
    setLoadingUpdate(true);

    const formData = new FormData();
    formData.append(field, value);

    const url = `${config.path.patient}${patientId}/`;

    axios({
      method: "patch",
      url,
      data: formData,
      ...config.axios,
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingUpdate(false);
        setCurrentValue(value);
      })
      .catch((err) => {
        console.log(err);
        uiInform && uiInform(`La requête a échoué: ${err.toString()}`, false);
        setLoadingUpdate(false);
      });
  };

  return (
    <React.Fragment>
      <Select
        margin="dense"
        id={`simple_field-${patientId}`}
        label={title}
        value={currentValue}
        // fullWidth
        onChange={onChange}
        multiline
      >
        {values.map((v) => (
          <MenuItem value={dataInterface[v]}>{v}</MenuItem>
        ))}
      </Select>
      {loadingUpdate && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackBar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={closeSnackBar}
          severity={snackbarSeverity}
        >
          {infoMsg}
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
}
