import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../config";

import TextField from "@material-ui/core/TextField";
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

import { initSchema, cloneSchema, flat } from "../shared/utils/schema";
import Form from "../components/Form";
import addPatientBasicFormSchema from "../json/schemaPatientBasic.json";
import { getAge } from "../shared/utils/date";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import * as _ from "lodash";
import { Grid } from "@material-ui/core";

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
  const [editDial, setEditDial] = React.useState(false);
  const [savedInfos, setSavedInfos] = React.useState([]);
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [editedInfos, setEditedInfos] = React.useState(_.cloneDeep(data));
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");

  delete addPatientBasicFormSchema.properties["NIP_id"];
  delete addPatientBasicFormSchema.required;
  const schemaBasicPatient = cloneSchema(addPatientBasicFormSchema).schema;

  const closeEditDial = () => {
    setEditDial(false);
  };

  const cancelEditDial = () => {
    setEditedInfos(_.cloneDeep(savedInfos));
    closeEditDial();
  };

  const openEditDial = () => {
    setEditDial(true);
    setSavedInfos(_.cloneDeep(dataCopy));
  };

  const onChangeInfos = (event) => {
    let id = event.target.id;

    editedInfos[id] = event.target.value;

    setEditedInfos(_.cloneDeep(editedInfos));
  };

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
  };

  const sexInterface = {
    H: "Homme",
    F: "Femme",
  };
  const severityInterface = ["A risque", "Instable", "Stable"];

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
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.toString());
        setSnackbarOpen(true);
        setLoadingCb(false);
      });
  }

  return (
    <Card className={classes.patientCard} >
      <CardContent>
        <Grid container space={2}>

          {dataCopy.current_unit_stay ? (
            <Grid item xs={12}>

              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {dataCopy.current_unit_stay.bed_description}
              </Typography>
            </Grid>
          ) : (
              <></>
            )}

          <Grid item xs={3} container direction="column">
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Patient n° {dataCopy.NIP_id}
              </Typography>
              </Grid>
              <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Sévérité: {severityInterface[dataCopy.severity]}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={3} container direction="column">
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom>
                {dataCopy.family_name ? dataCopy.family_name.toUpperCase() : "..."}
                {" "}
                {dataCopy.first_name || "..."}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {dataCopy.sex ? sexInterface[dataCopy.sex] : "Sexe non mentionné"}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {dataCopy.birth_date} ({getAge(dataCopy.birth_date)} ans)
          </Typography>
          </Grid>

          <Grid item xs={3} container direction="column">
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom>
                Poids: {dataCopy.weight_kg}kg
              </Typography>
            </Grid>
            <Grid item container direction="column">
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom>
                Taille: {dataCopy.size_cm}cm
            </Typography>
            </Grid>
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                (IMC: {(dataCopy.weight_kg / (dataCopy.size_cm / 100) ** 2).toFixed(2)})
            </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
      <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={openEditDial}>
          Modifier
          </Button>
      </CardActions>

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
          severity="error"
        >
          La requête a échoué {errMsg}
        </MuiAlert>
      </Snackbar>
    </Card >
  );
}
