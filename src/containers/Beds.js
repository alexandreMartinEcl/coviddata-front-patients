import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../config";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";

// import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { cloneSchema, flat } from "../shared/utils/schema";
import ReaTabs from "../components/ReaTabs";
import Form from "../components/Form";
import { manageError } from "../shared/utils/tools";

import { getAge, dateToDayStep } from "../shared/utils/date";
import addPatientBasicFormSchema from "../json/schemaPatientBasic.json";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import {
  Typography,
  useMediaQuery,
  Grid,
  ListSubheader,
  Box,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import {
  HeartFailureIcon,
  BioChemicalFailureIcon,
  BrainFailureIcon,
  LungFailureIcon,
  KidneyFailureIcon,
  LiverFailureIcon,
  BedIcon,
  ToWatchIcon,
} from "../shared/icons/index";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  unitTitle: {
    marginRight: "100px",
  },
  bedItem: {
    height: "60px",
    backgroundColor: theme.palette.background.paper,
  },
  bedItemSeverityHigh: {
    height: "60px",
    backgroundColor: theme.palette.danger.main,
  },
  bedItemSeverityMiddle: {
    height: "60px",
    backgroundColor: theme.palette.danger.light,
  },
  bedIndex: {
    width: "5px",
  },
  patientDetails: {
    width: "40%",
  },
  otherDetails: {
    width: "20%",
    primary: {
      fontSize: "1px",
    },
  },
  listItemSecAction: {},
  secActionButton: {},
}));

const icons = {
  heart_failure: (
    <HeartFailureIcon
      color="primary"
      style={{ width: "30px", height: "100%" }}
    />
  ),
  bio_chemical_failure: (
    <BioChemicalFailureIcon
      color="primary"
      style={{ width: "30px", height: "100%" }}
    />
  ),
  brain_failure: (
    <BrainFailureIcon
      color="primary"
      style={{ width: "30px", height: "100%" }}
    />
  ),
  lung_failure: (
    <LungFailureIcon
      color="primary"
      style={{ width: "30px", height: "100%" }}
    />
  ),
  kidney_failure: (
    <KidneyFailureIcon
      color="primary"
      style={{ width: "30px", height: "100%" }}
    />
  ),
  liver_failure: (
    <LiverFailureIcon
      color="primary"
      style={{ width: "30px", height: "100%" }}
    />
  ),
  bed: <BedIcon color="secondary" style={{ width: "30px", height: "100%" }} />,
  toWatch: (
    <ToWatchIcon color="secondary" style={{ width: "30px", height: "100%" }} />
  ),
};

function Beds({ data, reFetch, ...props }) {
  const classes = useStyles();
  const [page, setPage] = useState();
  const [openDialRea, setOpenDialRea] = React.useState(false);
  const [openDialPatient, setOpenDialPatient] = React.useState(false);
  const [openDialRemove, setOpenDialRemove] = React.useState(false);
  const [currentStay, setCurrentStay] = React.useState();
  const [currentBed, setCurrentBed] = React.useState();
  const [currentPatientName, setCurrentPatientName] = React.useState();
  const [formData, setFormData] = React.useState({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(false);
  const [infoMsg, setInfoMsg] = React.useState("");
  const [loadingRemovePatient, setLoadingRemovePatient] = React.useState(false);

  const schemaAddPatient = cloneSchema(addPatientBasicFormSchema).schema;

  const schemaAddRea = cloneSchema({
    title: "Assigner un nouveau service de réanimation",
    description: "Donner le code de l'unité donné par l'AP-HP",
    type: "object",
    required: ["reanimation_service_code"],
    properties: {
      reanimation_service_code: {
        type: "string",
        title: "Code d'accès",
      },
    },
  }).schema;

  // const bedStatusInterface = ["Utilisable", "Inutilisable"];
  const severityInterface = ["A risque", "Instable", "Stable"];

  const getBedSeverityClass = (severity) => {
    switch (severityInterface[severity]) {
      case "A risque":
        return classes.bedItemSeverityHigh;
      case "Instable":
        return classes.bedItemSeverityMiddle;
      case "Stable":
        return classes.bedItem;
      default:
        return classes.bedItem;
    }
  };

  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantForBedItem = isUpSm ? "body1" : "body2";

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

  const handlePatientClick = (idPatient) => {
    if (idPatient) {
      setPage(`/patient/${idPatient}`);
    } else {
      return;
    }
  };

  const handleAddReaOpen = () => {
    setOpenDialRea(true);
  };

  const handleAddPatientOpen = (idBed) => {
    setCurrentBed(idBed);
    let currentDay = new Date().toISOString().split("T")[0];
    setFormData({ stay_start_date: currentDay });
    setOpenDialPatient(true);
  };

  const handleRemoveOpen = (idStay, patientName) => {
    setCurrentStay(idStay);
    setCurrentPatientName(patientName);
    setOpenDialRemove(true);
  };

  const handleAddReaClose = () => {
    setOpenDialRea(false);
  };

  const handleAddPatientClose = () => {
    setCurrentBed(null);
    setOpenDialPatient(false);
  };

  const handleAddPatientCancel = () => {
    setFormData({});
    handleAddPatientClose();
  };

  const handleRemoveClose = () => {
    setCurrentStay(null);
    setCurrentPatientName(null);
    setOpenDialRemove(false);
  };

  const buildFailuresIconsGrids = (patient) => {
    const toDisplay = [
      "heart_failure",
      "bio_chemical_failure",
      "brain_failure",
      "lung_failure",
      "kidney_failure",
      "liver_failure",
    ].filter((k) => patient[k]);

    return toDisplay.length ? (
      <Grid
        container
        spacing={2}
        justify="flex-start"
        style={{ width: "120px" }}
      >
        {toDisplay.map((k) => {
          return (
            <Grid key={k} item xs={4}>
              {icons[k]}
            </Grid>
          );
        })}
      </Grid>
    ) : (
      <></>
    );
  };

  function onSubmitAddRea(initialData, setLoadingCb) {
    setLoadingCb(true);

    const fData = flat(initialData);
    const dataToSend = {};
    for (let [key, value] of Object.entries(fData)) {
      dataToSend[key] = value;
    }

    const url = `${config.path.bed}`;

    axios
      .get(url, {
        params: dataToSend,
        ...config.axios,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res);
        setLoadingCb(false);
        if (res.data.count === 0) {
          uiInform("Aucune unité n'a été trouvée avec ce code", "error");
        } else {
          handleAddReaClose();
          localAddRea(res.data.results[0]);
        }
      })
      .catch((err) => {
        setLoadingCb(false);
        manageError(err.response, uiInform);
      });
  }

  const localAddRea = (rea) => {
    let reaNames = data.results.map((r) => r.name);
    if (!reaNames.find((name) => rea.name === name)) {
      data.results.push(rea);
      uiInform(`L'unité de réanimation ${rea.name} a été récupérée`, "success");
    } else {
      uiInform(
        `L'unité de réanimation ${rea.name} était déjà ajoutée`,
        "warning"
      );
    }
  };

  function onSubmitAddPatient(initialData, setLoadingCb) {
    setLoadingCb(true);

    const data = flat(initialData);
    const dataToSend = new FormData();

    for (let [key, value] of Object.entries(data)) {
      if (key === "stay_start_date") {
        value && dataToSend.append(key, value);
      } else {
        dataToSend.append(key, value);
      }
    }
    dataToSend.append("bed", currentBed);

    const url = config.path.patient;

    axios({
      method: "post",
      url,
      data: dataToSend,
      ...config.axios,
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingCb(false);
        handleAddPatientClose();
        setPage(`/patient/${res.data.id}`);
      })
      .catch((err) => {
        manageError(err.response, uiInform);
      });
  }

  function onSubmitRemovePatient() {
    setLoadingRemovePatient(true);
    const dataToSend = new FormData();

    dataToSend.append("terminate", true);
    const url = `${config.path.stay}${currentStay}/`;

    axios({
      method: "patch",
      url,
      data: dataToSend,
      ...config.axios,
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingRemovePatient(false);
        handleRemoveClose();
        reFetch();
      })
      .catch((err) => {
        manageError(err.response, uiInform);
      });
  }

  const FormAddPatient = (props) => (
    <Form
      schema={schemaAddPatient}
      formData={formData}
      onSubmit={(form, setLoadingCb) =>
        onSubmitAddPatient(form.formData, setLoadingCb)
      }
    />
  );

  const FormAddRea = (props) => (
    <Form
      schema={schemaAddRea}
      // uiSchema={}
      onSubmit={(form, setLoadingCb) =>
        onSubmitAddRea(form.formData, setLoadingCb)
      }
    />
  );

  const displayName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
  };

  const getReaListBeds = (rea) => {
    return rea.units.reduce((a, b) => {
      let t = a.beds.slice(0);
      t.splice(-1, 0, ...b.beds);
      return { beds: t };
    }).beds;
  };

  const computeNbSeverePatients = (rea) => {
    let beds = getReaListBeds(rea);
    return beds.filter(
      (b) =>
        b.current_stay &&
        severityInterface[b.current_stay.patient.severity] === "A risque"
    ).length;
  };

  const computeNbAvailableBeds = (rea) => {
    let beds = getReaListBeds(rea);
    return beds.filter((b) => !b.current_stay).length;
  };

  const bedItemList = (bed, unitName) => {
    const { unit_index, status, current_stay } = bed;
    const { patient, start_date } = current_stay ? current_stay : {};
    const idStay = current_stay ? current_stay.id : {};
    const {
      first_name,
      family_name,
      birth_date,
      severity,
      hospitalisation_cause,
      sex,
    } = patient ? patient : {};
    const idPatient = patient ? patient.id : {};
    return current_stay ? (
      <ListItem
        key={bed.id}
        button
        // divider
        className={getBedSeverityClass(severity)}
        onClick={() => handlePatientClick(idPatient)}
      >
        <ListItemText
          id={`bedIndex-${unit_index}`}
          primary={unit_index}
          className={classes.bedIndex}
        />

        <ListItemText
          id={`patientDetails-${idPatient}`}
          primary={
            displayName(first_name, family_name) + (sex ? ` (${sex})` : "")
          }
          secondary={birth_date ? `${getAge(birth_date)} ans` : ""}
          className={classes.patientDetails}
          primaryTypographyProps={{ variant: variantForBedItem }}
          secondaryTypographyProps={{ variant: variantForBedItem }}
        />
        <ListItemText
          id={`otherDetails-${idPatient}`}
          primary={`${dateToDayStep(start_date)}`}
          secondary={hospitalisation_cause}
          className={classes.otherDetails}
          primaryTypographyProps={{ variant: variantForBedItem }}
          secondaryTypographyProps={{ variant: variantForBedItem }}
        />
        {buildFailuresIconsGrids(patient)}
        <ListItemSecondaryAction className={classes.listItemSecAction}>
          <IconButton
            onClick={() =>
              handleRemoveOpen(idStay, displayName(first_name, family_name))
            }
            color="primary"
          >
            <RemoveIcon fontSize="large" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ) : (
      <ListItem
        key={bed.id}
        role={undefined}
        button
        // divider
        className={classes.bedItem}
        onClick={() => handleAddPatientOpen(bed.id)}
      >
        <ListItemText
          id={`bedIndex-${unit_index}`}
          primary={unit_index}
          className={classes.bedIndex}
        />
        <ListItemText
          id={`dispo-${bed.id}`}
          primary={Number(status) === 0 ? "Libre" : "Indisponible"}
          className={classes.patientDetails}
          primaryTypographyProps={{ variant: variantForBedItem }}
        />
        <ListItemText
          id={`space-${bed.id}`}
          primary={""}
          className={classes.otherDetails}
        />
        <ListItemSecondaryAction className={classes.listItemSecAction}>
          <IconButton
            onClick={() => handleAddPatientOpen(bed.id)}
            color="secondary"
          >
            <AddIcon fontSize="large" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return page ? (
    <Redirect push to={page} />
  ) : (
    <div className={classes.root}>
      <ReaTabs
        labels={data.results.map((rea, id) =>
          Object.assign({}, { title: rea.name, index: id })
        )}
        contents={data.results.map((rea, id) => {
          return {
            id: id,
            toRender: (
              <React.Fragment>
                <Box
                  border={1}
                  style={{
                    padding: "1px",
                    marginLeft: "10px",
                    width: "40%",
                    borderColor: th.palette.primary.light,
                    borderRadius: "5px",
                    backgroundColor: "white",
                  }}
                >
                  <Grid container alignItems="center" justify="space-around">
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {icons.toWatch} Cas à gravité haute:{" "}
                        {computeNbSeverePatients(rea)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {icons.bed} Lits libres: {computeNbAvailableBeds(rea)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {rea.units.map((unit) => (
                  <Paper key={unit.name}>
                    <List
                      subheader={
                        <ListSubheader
                          component="div"
                          id="nested-list-subheader"
                        >
                          {unit.name}
                        </ListSubheader>
                      }
                    >
                      {unit.beds
                        .sort((a, b) => a.unit_index >= b.unit_index)
                        .map((bed) => bedItemList(bed, unit.name))}
                    </List>
                  </Paper>
                ))}
              </React.Fragment>
            ),
          };
        })}
        onAddRea={handleAddReaOpen}
      ></ReaTabs>

      <Dialog
        open={openDialRea}
        onClose={handleAddReaClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <FormAddRea />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddReaClose} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialPatient}
        onClose={handleAddPatientClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Formulaire d'ajout de patient
        </DialogTitle>
        <DialogContent>
          <FormAddPatient />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddPatientCancel} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialRemove}
        onClose={handleRemoveClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Retrait d'un patient</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir retirer le patient: {currentPatientName} ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveClose} color="primary">
            Annuler
          </Button>
          <Button onClick={onSubmitRemovePatient} color="primary">
            Oui
          </Button>
          {loadingRemovePatient && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
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
    </div>
  );
}

export default Beds;
