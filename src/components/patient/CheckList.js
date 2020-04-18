import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../../config";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import CircularProgress from "@material-ui/core/CircularProgress";
import * as _ from "lodash";
import { Tooltip, Grid } from "@material-ui/core";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  customCheckbox: {
    width: "50px",
    height: "50px",
  },
}));

export default function PatientHeader({
  patientId,
  title,
  label,
  customIcons,
  dataInterface = {},
  suggestedData = {},
  setSuggestedData,
  data = {},
  readOnly,
}) {
  const classes = useStyles();
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data.checks));
  const [editedInfos, setEditedInfos] = React.useState(
    _.cloneDeep(data.checks)
  );
  const [userEdit, setUserEdit] = React.useState(false);

  const [errorCheck, setErrorCheck] = React.useState(false);
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

  const handleChange = (event) => {
    let temData = _.cloneDeep(editedInfos);
    temData[event.target.name] = event.target.checked;
    setEditedInfos(_.cloneDeep(temData));
    setErrorCheck(
      Object.keys(dataCopy).filter((k) => dataCopy[k] !== temData[k]).length > 0
    );
    setUserEdit(true);
    // setSuggestedData && setSuggestedData(_.cloneDeep(temData));
  };

  if (!userEdit && Object.keys(suggestedData).length) {
    let temData = _.cloneDeep(editedInfos);
    Object.assign(temData, suggestedData);

    if (!_.isEqual(temData, editedInfos)) {
      setEditedInfos(_.cloneDeep(temData));
      setErrorCheck(
        Object.keys(dataCopy).filter((k) => dataCopy[k] !== temData[k]).length >
          0
      );
    }
  }

  const onCancel = () => {
    let temData = _.cloneDeep(dataCopy);
    setEditedInfos(_.cloneDeep(temData));
    setErrorCheck(
      Object.keys(dataCopy).filter((k) => dataCopy[k] !== temData[k]).length > 0
    );
    setUserEdit(true);
  };

  const onSubmitInfos = () => {
    let temData = _.cloneDeep(editedInfos);

    setLoadingUpdate(true);

    const formData = new FormData();
    for (let [key, value] of Object.entries(temData)) {
      formData.append(key, value);
    }

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
        setDataCopy(_.cloneDeep(temData));
        setErrorCheck(false);
      })
      .catch((err) => {
        console.log(err);
        uiInform && uiInform(`La requête a échoué: ${err.toString()}`, false);
        setLoadingUpdate(false);
      });
  };

  const CustomFormControlLabel = (key, value) => {
    return customIcons ? (
      <Grid item xs={2}>
        <FormControlLabel
          control={
            <React.Fragment>
              <Tooltip title={dataInterface[key]} arrow>
                <Checkbox
                  checkedIcon={customIcons[key]}
                  icon={customIcons[key]}
                  className={classes.customCheckbox}
                  name={key}
                  checked={value}
                  onChange={handleChange}
                  color="primary"
                  size="medium"
                />
              </Tooltip>
            </React.Fragment>
          }
        />
      </Grid>
    ) : (
      <FormControlLabel
        control={
          <Checkbox name={key} checked={value} onChange={handleChange} />
        }
        label={dataInterface[key]}
      />
    );
  };

  return (
    <React.Fragment>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <FormControl
            component="fieldset"
            error={errorCheck}
            className={classes.formControl}
          >
            <FormLabel component="legend">{title}</FormLabel>
            <FormGroup>
              <Grid container justify="flex-start">
                {Object.entries(editedInfos).map((e) =>
                  CustomFormControlLabel(e[0], e[1])
                )}
              </Grid>
            </FormGroup>
            <FormHelperText>
              Pensez à enregistrer si vous modifiez
            </FormHelperText>
          </FormControl>
        </CardContent>
        {readOnly ? (
          <></>
        ) : (
          <CardActions>
            <Button
              size="small"
              onClick={onCancel}
              variant={errorCheck ? "outlined" : ""}
            >
              Annuler les changements
            </Button>
            <Button
              size="small"
              onClick={onSubmitInfos}
              variant="outlined"
              color={errorCheck ? "primary" : ""}
            >
              Enregistrer
            </Button>
            {loadingUpdate && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </CardActions>
        )}
      </Card>

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
