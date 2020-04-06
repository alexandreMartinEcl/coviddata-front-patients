import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../config";

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
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import * as _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function PatientHeader({ patientId, title, label, data = {} }) {
  const classes = useStyles();
  const clone = (obj) => {
    return Object.assign({}, obj);
  };
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data.checks));
  const [editedInfos, setEditedInfos] = React.useState(
    _.cloneDeep(data.checks)
  );
  const [errorCheck, setErrorCheck] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  const handleChange = (event) => {
    let temData = _.cloneDeep(editedInfos);
    temData[event.target.name] = event.target.checked;
    setEditedInfos(_.cloneDeep(temData));
    setErrorCheck(
      Object.keys(dataCopy).filter((k) => dataCopy[k] !== temData[k]).length > 0
    );
  };

  const onCancel = () => {
    let temData = _.cloneDeep(dataCopy);
    setEditedInfos(_.cloneDeep(temData));
    setErrorCheck(
      Object.keys(dataCopy).filter((k) => dataCopy[k] !== temData[k]).length > 0
    );
  };

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
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
        setErrMsg(err.toString());
        setSnackbarOpen(true);
        setLoadingUpdate(false);
      });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <FormControl
            component="fieldset"
            error={errorCheck}
            className={classes.formControl}
          >
            <FormLabel component="legend">{title}</FormLabel>
            <FormGroup>
              {Object.keys(editedInfos).map((k) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editedInfos[k]}
                        onChange={handleChange}
                        name={k}
                      />
                    }
                    label={k}
                  />
                );
              })}
            </FormGroup>
            <FormHelperText>
              Pensez à sauvegarder si vous modifez
            </FormHelperText>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={onCancel}>
            Annuler les changements
          </Button>
          <Button size="small" onClick={onSubmitInfos}>
            Enregistrer
          </Button>
          {loadingUpdate && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </CardActions>
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
          severity="error"
        >
          La requête a échoué {errMsg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
