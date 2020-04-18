import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../config";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/AddCircle";

import { cloneSchema, flat } from "../shared/utils/schema";
import Form from "../components/Form";
import addPatientBasicFormSchema from "../json/schemaPatientBasic.json";
import { getAge, dateToDayStep } from "../shared/utils/date";
import * as _ from "lodash";
import { Grid, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  patientCard: {
    flexGrow: 1,
    width: "100%",
    borderColor: theme.palette.primary.main,
    borderInline: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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

export default function PatientHeader({
  patientId,
  title,
  label,
  data = {},
  reFetch,
  readOnly,
}) {
  const classes = useStyles();
  const [editDial, setEditDial] = React.useState(false);
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));

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

  const schemaBasicPatient = cloneSchema(addPatientBasicFormSchema).schema;
  delete schemaBasicPatient.properties["NIP_id"];
  delete schemaBasicPatient.properties["stay_start_date"];
  delete schemaBasicPatient.required;

  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantHeaderContent = isUpSm ? "body1" : "body2";

  const closeEditDial = () => {
    setEditDial(false);
  };

  const cancelEditDial = () => {
    closeEditDial();
  };

  const openEditDial = () => {
    setEditDial(true);
  };

  const sexInterface = {
    H: "Homme",
    F: "Femme",
  };
  const severityInterface = ["A risque", "Instable", "Stable"];

  const updateDisplayed = (resData) => {
    let temData = _.cloneDeep(dataCopy);
    let resKeys = Object.keys(resData);
    Object.keys(temData).forEach((k) => {
      if (resKeys.find((rk) => rk === k)) {
        temData[k] = resData[k];
      }
    });
    setDataCopy(temData);
  };

  function onSubmitInfos(initialData, setLoadingCb) {
    setLoadingCb(true);

    const data = flat(initialData);
    const formData = new FormData();

    for (let [key, value] of Object.entries(data)) {
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
        setLoadingCb(false);
        closeEditDial();
        updateDisplayed(res.data);
      })
      .catch((err) => {
        console.log(err);
        uiInform && uiInform(`La requête a échoué: ${err.toString()}`, false);
        setLoadingCb(false);
      });
  }

  // bed_description is like '1 - Lit 1 - Unité Sirrocco (Réanimation Rea1 - Hôpital Lariboisière) (1234)'
  let [
    ,
    bedIndex,
    unitPart1,
    unitPart2,
  ] = dataCopy.current_unit_stay.bed_description.split(" - ");
  unitPart2 = unitPart2.split(") (")[0] + ")";
  console.log("here", data.hospitalisationDate);
  const bedInfo = `${[bedIndex, unitPart1, unitPart2].join(
    " - "
  )} (${dateToDayStep(data.hospitalisationDate)})`;

  return (
    <Card className={classes.patientCard}>
      <CardContent>
        <Grid container space={2}>
          {dataCopy.current_unit_stay ? (
            <Grid item xs={12} sm={12}>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                {dataCopy.current_unit_stay
                  ? bedInfo
                  : "A quitté la réanimation"}
              </Typography>
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={6} sm={3} container direction="column">
            <Grid item>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                Patient n° {dataCopy.NIP_id}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                Motif: {severityInterface[dataCopy.hospitalisation_cause]}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={3} container direction="column">
            <Grid item>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                {dataCopy.family_name
                  ? dataCopy.family_name.toUpperCase()
                  : "..."}{" "}
                {dataCopy.first_name || "..."}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                {dataCopy.sex
                  ? sexInterface[dataCopy.sex]
                  : "Sexe non mentionné"}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Typography
              variant={variantHeaderContent}
              className={classes.title}
              gutterBottom
            >
              {dataCopy.birth_date} ({getAge(dataCopy.birth_date)} ans)
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} container direction="column">
            <Grid item>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                Poids: {dataCopy.weight_kg}kg
              </Typography>
            </Grid>
            <Grid item container direction="column">
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                Taille: {dataCopy.size_cm}cm
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant={variantHeaderContent}
                className={classes.title}
                gutterBottom
              >
                (IMC:{" "}
                {(dataCopy.weight_kg / (dataCopy.size_cm / 100) ** 2).toFixed(
                  2
                )}
                )
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      {readOnly ? (
        <></>
      ) : (
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={openEditDial}
          >
            Modifier
          </Button>
        </CardActions>
      )}

      <Dialog
        open={editDial}
        onClose={closeEditDial}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Modification des {title}
        </DialogTitle>
        <DialogContent>
          <Form
            schema={schemaBasicPatient}
            formData={dataCopy}
            onSubmit={(form, setLoadingCb) =>
              onSubmitInfos(form.formData, setLoadingCb)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEditDial} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

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
    </Card>
  );
}
