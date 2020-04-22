import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../../config";

import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MenuItem, Box, Grid } from "@material-ui/core";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { manageError } from "../../shared/utils/tools";

const useStyles = makeStyles((theme) => ({}));

export default function SimpleSelect({
  patientId,
  title,
  data = {},
  field,
  values = [],
  dataInterface = {},
  icons = {},
  colors = {},
  reFetch,
  readOnly,
}) {
  const classes = useStyles();
  const [currentValue, setCurrentValue] = React.useState(data[field]);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(false);
  const [infoMsg, setInfoMsg] = React.useState("");

  /**
   * Display information snackbar
   * @param {string} msg
   * @param {string} infoType either 'success', 'error', 'info' or 'warning'
   */
  const uiInform = (msg, infoType) => {
    setInfoMsg(msg);
    setSnackbarSeverity(infoType);
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
        setLoadingUpdate(false);
        manageError(err.response, uiInform);
      });
  };

  return (
    <React.Fragment>
      <Box
        border={1}
        style={{
          margin: "2px",
          padding: "2px",
          backgroundColor: "white",
          borderWidth: "1px",
          borderColor: "#CAF1EC",
          borderRadius: "10px",
        }}
      >
        <Grid container alignItems="center" justify="center">
          {Object.keys(icons).length ? icons[currentValue] : <></>}
          <Select
            margin="dense"
            id={`simple_field-${patientId}`}
            label={title}
            value={currentValue}
            onChange={onChange}
            style={{ margin: "4px", color: colors[currentValue] }}
            variant="outlined"
          >
            {values.map((v) => (
              <MenuItem key={v} value={dataInterface[v]}>
                {v}
              </MenuItem>
            ))}
          </Select>
          {loadingUpdate && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Grid>
      </Box>
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
