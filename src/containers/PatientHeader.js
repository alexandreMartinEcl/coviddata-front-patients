import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../config";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/AddCircle";
import HistoryIcon from "@material-ui/icons/History";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getAge, dateToDayStep } from "../shared/utils/date";
import * as _ from "lodash";
import {
  Grid,
  useMediaQuery,
  Box,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { manageError } from "../shared/utils/tools";

const useStyles = makeStyles((theme) => ({
  boldHeader: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  italicComplement: {
    fontStyle: "italic",
    marginLeft: "5px",
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
  // const [editDial, setEditDial] = React.useState(false);
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [editedData, setEditedData] = React.useState(_.cloneDeep(data));
  const [isEditable, setIsEditable] = React.useState(_.cloneDeep(false));
  const [cellFocus, setCellFocus] = React.useState("");

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

  const handleKeyPress = (event) => {
    switch (event.key) {
      case "Enter":
        submit();
        break;
      case "Escape":
        onCancel();
        break;
      default:
        return;
    }
  };

  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantHeaderContent = isUpSm ? "body1" : "body2";

  const makeEditable = (focus = "") => {
    if (!readOnly) {
      setCellFocus(focus);
      setIsEditable(true);
    }
  };

  const makeUnEditable = () => {
    setIsEditable(false);
  };

  const onCancel = () => {
    setEditedData(_.cloneDeep(dataCopy));
    makeUnEditable();
  };

  const editValue = (field) => {
    return (event) => {
      let temEditedData = _.cloneDeep(editedData);
      temEditedData[field] = event.target.value;
      setEditedData(_.cloneDeep(temEditedData));
    };
  };

  const sexInterface = {
    H: "Homme",
    F: "Femme",
  };

  const updateDisplayed = (resData) => {
    let temData = _.cloneDeep(dataCopy);
    let resKeys = Object.keys(resData);
    Object.keys(temData).forEach((k) => {
      if (resKeys.find((rk) => rk === k)) {
        temData[k] = resData[k];
      }
    });
    setDataCopy(_.cloneDeep(temData));
    setDataCopy(_.cloneDeep(temData));
  };

  function submit() {
    setLoadingUpdate(true);

    let jsonData = {};

    let temEditedData = _.cloneDeep(editedData);
    delete temEditedData.current_unit_stay;
    delete temEditedData.hospitalisationDate;

    Object.entries(temEditedData)
      .filter(([key, value]) => dataCopy[key] !== value)
      .forEach(([key, value]) => {
        jsonData[key] = value;
      });

    const url = `${config.path.patient}${patientId}/`;

    console.log("Sending to:", url);
    console.log(jsonData);
    axios({
      method: "patch",
      url,
      data: jsonData,
      ...config.axios,
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingUpdate(false);
        updateDisplayed(res.data);
        makeUnEditable();
      })
      .catch((err) => {
        setLoadingUpdate(false);
        manageError(err.response, uiInform);
      });
  }

  // bed_description is like '1 - Lit 1 - Unité Sirrocco (Réanimation Rea1 - Hôpital Lariboisière) (1234)'

  let bedInfo;
  if (dataCopy.current_unit_stay) {
    let [
      ,
      bedIndex,
      unitPart1,
      unitPart2,
    ] = dataCopy.current_unit_stay.bed_description.split(" - ");
    unitPart2 = unitPart2.split(") (")[0] + ")";
    bedInfo = `${[bedIndex, unitPart1, unitPart2].join(" - ")} (${dateToDayStep(
      data.hospitalisationDate
    )})`;
  }

  const DataCell = ({
    editable,
    dataType,
    variant,
    multiline,
    value,
    infoToAdd = "",
    label,
    onDoubleClick,
    ...props
  }) => {
    if (!editable) {
      return (
        <Box
          border={1}
          style={{
            margin: "2px",
            padding: "2px",
            borderWidth: "1px",
            borderColor: "#CAF1EC",
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={1}>
            <Typography
              onDoubleClick={onDoubleClick}
              variant={variant}
              className={classes.boldHeader}
              {...props}
            >
              {label}:{" "}
            </Typography>
            <Typography
              onDoubleClick={onDoubleClick}
              variant={variant}
              {...props}
            >
              {value}
            </Typography>
            <Typography
              onDoubleClick={onDoubleClick}
              variant={variant}
              className={classes.italicComplement}
              {...props}
            >
              {infoToAdd}
            </Typography>
          </Grid>
        </Box>
      );
    }
    return dataType.enum ? (
      <Select
        margin="dense"
        label={label}
        value={value}
        variant="outlined"
        style={{ margin: "4px" }}
        {...props}
      >
        {dataType.enum.map((v, i) => (
          <MenuItem key={v} value={v}>
            {dataType.enumNames[i]}
          </MenuItem>
        ))}
      </Select>
    ) : (
      <TextField
        type={dataType.valueType}
        label={label}
        value={value}
        variant="outlined"
        multiline={multiline}
        style={{ margin: "4px", width: "95%" }}
        {...props}
      />
    );
  };

  return (
    <React.Fragment>
      <Box
        style={{
          padding: "2px",
          margin: "15px",
          backgroundColor: "white",
          borderRadius: "15px",
        }}
      >
        <Grid container space={2}>
          <Grid item xs={12} sm={12}>
            <DataCell
              value={
                dataCopy.current_unit_stay ? bedInfo : "A quitté la réanimation"
              }
              variant={variantHeaderContent}
              editable={false}
              label="Situation"
            />
          </Grid>

          <Grid item xs={6} sm={6} container direction="column">
            <Grid item>
              <DataCell
                value={editedData.NIP_id}
                editable={isEditable}
                label="NIP"
                variant={variantHeaderContent}
                autoFocus={cellFocus === "NIP_id"}
                onChange={editValue("NIP_id")}
                dataType={{ valueType: "string" }}
                onKeyDown={handleKeyPress}
                onDoubleClick={() => {
                  makeEditable("NIP_id");
                }}
              />
            </Grid>
            <Grid item>
              <DataCell
                value={
                  editedData.family_name
                    ? editedData.family_name.toUpperCase()
                    : "..."
                }
                editable={isEditable}
                label="Nom"
                variant={variantHeaderContent}
                autoFocus={cellFocus === "family_name"}
                onChange={editValue("family_name")}
                dataType={{ valueType: "string" }}
                onDoubleClick={() => makeEditable("family_name")}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item>
              <DataCell
                value={editedData.first_name || "..."}
                editable={isEditable}
                label="Prénom"
                variant={variantHeaderContent}
                autoFocus={cellFocus === "first_name"}
                onChange={editValue("first_name")}
                dataType={{ valueType: "string" }}
                onDoubleClick={() => makeEditable("first_name")}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item>
              <DataCell
                value={editedData.sex}
                editable={isEditable}
                label="Sexe"
                variant={variantHeaderContent}
                autoFocus={cellFocus === "sex"}
                onChange={editValue("sex")}
                dataType={{
                  valueType: "string",
                  enum: Object.keys(sexInterface),
                  enumNames: Object.values(sexInterface),
                }}
                onDoubleClick={() => makeEditable("sex")}
              />
            </Grid>
          </Grid>

          <Grid item xs={6} sm={6} container direction="column">
            <Grid item>
              <DataCell
                value={editedData.birth_date}
                editable={isEditable}
                label="Naissance"
                infoToAdd={`(${getAge(dataCopy.birth_date)} ans)`}
                variant={variantHeaderContent}
                autoFocus={cellFocus === "birth_date"}
                onChange={editValue("birth_date")}
                dataType={{ valueType: "date" }}
                onDoubleClick={() => makeEditable("birth_date")}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item>
              <DataCell
                value={editedData.weight_kg}
                editable={isEditable}
                label="Poids (kg)"
                variant={variantHeaderContent}
                autoFocus={cellFocus === "weight_kg"}
                onChange={editValue("weight_kg")}
                dataType={{ valueType: "number" }}
                onDoubleClick={() => makeEditable("weight_kg")}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item container direction="column">
              <DataCell
                value={editedData.size_cm}
                editable={isEditable}
                label="Taille (cm)"
                infoToAdd={`(IMC: 
                  ${(
                    dataCopy.weight_kg /
                    (dataCopy.size_cm / 100) ** 2
                  ).toFixed(2)})`}
                variant={variantHeaderContent}
                autoFocus={cellFocus === "size_cm"}
                onChange={editValue("size_cm")}
                dataType={{ valueType: "number" }}
                onDoubleClick={() => makeEditable("size_cm")}
                onKeyDown={handleKeyPress}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <DataCell
              value={editedData.hospitalisation_cause}
              editable={isEditable}
              label="Motif"
              variant={variantHeaderContent}
              autoFocus={cellFocus === "hospitalisation_cause"}
              onChange={editValue("hospitalisation_cause")}
              dataType={{ valueType: "string" }}
              multiline
              onDoubleClick={() => makeEditable("hospitalisation_cause")}
            />
          </Grid>
        </Grid>
        {isEditable ? (
          <div>
            <Grid container justify="space-around" space={1}>
              <Grid item xs={5}>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  style={{ margin: "2px" }}
                  onClick={onCancel}
                >
                  Rétablir
                </Button>
              </Grid>
              <Grid item xs={7}>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  style={{ margin: "2px" }}
                  onClick={submit}
                >
                  Enregistrer
                </Button>
                {loadingUpdate && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Grid>
            </Grid>
          </div>
        ) : (
          <React.Fragment>
            {readOnly ? (
              <></>
            ) : (
              <Button
                size="small"
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                style={{ margin: "2px" }}
                onClick={makeEditable}
              >
                Modifier
              </Button>
            )}
          </React.Fragment>
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
      </Box>
    </React.Fragment>
  );
}
