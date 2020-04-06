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

import { initSchema, cloneSchema, flat } from "../shared/utils/schema";
import Form from "../components/Form";
import addPatientBasicFormSchema from "../json/schemaPatientBasic.json";
import { getAge } from "../shared/utils/date";
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

  const fieldTypes = {
    first_name: "text",
    family_name: "text",
    birth_date: "date",
    weight_kg: "number",
    size_cm: "number",
  };

  const fieldEditable = {
    bed: false,
    NIP_id: false,
    first_name: true,
    family_name: true,
    birth_date: true,
    weight_kg: true,
    size_cm: true,
  };

  const fieldLabels = {
    first_name: "Prénom",
    family_name: "Nom de famille",
    birth_date: "Date de naissance",
    weight_kg: "Poids (kg)",
    size_cm: "Taille (cm)",
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

  // const onSubmitInfos = () => {
  //   let tempInfos = _.cloneDeep(editedInfos);
  //   setDataCopy(_.cloneDeep(tempInfos));
  //   setEditedInfos(_.cloneDeep(tempInfos));
  //   setSavedInfos([]);
  //   setEditDial(false);
  // };

  return (
    <div className={classes.root}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          {dataCopy.current_unit_stay ? (
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {dataCopy.current_unit_stay.bed_description}
            </Typography>
          ) : (
            <></>
          )}
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Patient n° {dataCopy.NIP_id}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {dataCopy.family_name} {dataCopy.first_name}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {dataCopy.birth_date} ({getAge(dataCopy.birth_date)}
            ans)
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Poids: {dataCopy.weight_kg}kg
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Taille: {dataCopy.size_cm}cm
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            (IMC: {dataCopy.weight_kg / (dataCopy.size_cm / 100) ** 2})
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {dataCopy.sex ? sexInterface[dataCopy.sex] : "Sexe non mentionné"}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Sévérité: {severityInterface[dataCopy.severity]}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={openEditDial}>
            Modifier
          </Button>
        </CardActions>
      </Card>
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
          {/* {Object.keys(editedInfos).map((k) => {
            return fieldEditable[k] ? (
              <TextField
                id={k}
                onChange={onChangeInfos}
                label={fieldLabels[k]}
                type={fieldTypes[k]}
                value={editedInfos[k]}
              />
            ) : (
                <></>
              );
          })} */}
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
    </div>
  );
}
