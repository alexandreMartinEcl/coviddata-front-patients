import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import axios from "axios";
import config from "../../config";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as _ from "lodash";
import { useMediaQuery, Box } from "@material-ui/core";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  label: {
    backgroundColor: "white",
    textAlign: "center",
    margin: "5px",
    borderRadius: "10px",
  },
  labelTitle: {
    backgroundColor: theme.palette.primary.light,
    textColor: "white",
    textAlign: "center",
    borderRadius: "15px",
    verticalAlign: "middle",
    height: "40px",
  },
}));

export default function ListLabels({
  patientId,
  title,
  doubleInfoElseSingle = false,
  field,
  data = {},
  formatData,
  reFetch,
  readOnly,
}) {
  const classes = useStyles();
  const [editDial, setEditDial] = React.useState(false);
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data.listItems));
  const [editedLabels, setEditedLabels] = React.useState(
    _.cloneDeep(data.listItems)
  );
  const [loadingUpdateLabels, setLoadingUpdateLabels] = React.useState(false);

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

  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantLabelContent = isUpSm ? "body1" : "body2";

  const closeEditDial = () => {
    setEditDial(false);
  };

  const cancelEditDial = () => {
    setEditedLabels(_.cloneDeep(dataCopy));
    closeEditDial();
  };

  const openEditDial = () => {
    setEditDial(true);
  };

  const buildId = (name, i) => `${name}-${i}`;
  const getNameIndexFromId = (id) => id.split("-");

  const onChangeLabels = (event) => {
    let id = event.target.id;

    if (doubleInfoElseSingle) {
      let [name, index] = getNameIndexFromId(id);
      editedLabels[index][name] = event.target.value;
    } else {
      let [, index] = getNameIndexFromId(id);
      editedLabels[index] = event.target.value;
    }

    setEditedLabels(_.cloneDeep(editedLabels));
  };

  const removeEditedLabel = (index) => {
    if (doubleInfoElseSingle) {
      editedLabels.splice(index, 1);
    } else {
      editedLabels.splice(index, 1);
    }

    setEditedLabels(_.cloneDeep(editedLabels));
  };

  const addEditedLabel = () => {
    if (doubleInfoElseSingle) {
      editedLabels.push({ title: "", value: "" });
    } else {
      editedLabels.push("");
    }

    setEditedLabels(_.cloneDeep(editedLabels));
  };

  const updateLabels = (resData) => {
    setDataCopy(formatData(resData[field]));
  };

  const onSubmitLabels = () => {
    let tempLabels = doubleInfoElseSingle
      ? editedLabels.filter((i) => i.title.trim())
      : editedLabels.filter((i) => i.trim());
    setEditedLabels(_.cloneDeep(tempLabels));

    setLoadingUpdateLabels(true);

    let tempData;
    if (doubleInfoElseSingle) {
      tempData = {};
      tempLabels.forEach((item) => {
        tempData[item.title] = item.value;
      });
    } else {
      tempData = tempLabels;
    }

    let formData = {};
    formData[field] = JSON.stringify(tempData);
    const url = `${config.path.patient}${patientId}/`;

    axios({
      method: "patch",
      url,
      data: formData,
      ...config.axios,
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingUpdateLabels(false);
        setEditDial(false);

        updateLabels(res.data);
      })
      .catch((err) => {
        console.log(err);
        uiInform && uiInform(`La requête a échoué: ${err.toString()}`, false);
        setLoadingUpdateLabels(false);
      });
  };

  const labelComponent = (item) => {
    return doubleInfoElseSingle ? (
      <Grid item xs={6} sm={4} key={item ? item.title : "Aucun"}>
        <Box className={classes.label}>
          <Grid container spacing={1} justify={"center"} alignContent="center">
            <Grid item>
              <Typography variant={variantLabelContent}>
                {item ? item.title : "Aucun"}:{" "}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography variant={variantLabelContent}>
                {item ? item.value : ""}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    ) : (
      <Grid item xs={6} sm={4} key={item ? item : "Aucun"}>
        <Box className={classes.label}>
          <Typography variant={variantLabelContent}>
            {item ? item : "Aucun"}
          </Typography>
        </Box>
      </Grid>
    );
  };

  const editableLabelComponent = (item, i) => {
    return doubleInfoElseSingle ? (
      <Grid key={i}>
        <TextField
          id={buildId("title", i)}
          onChange={onChangeLabels}
          type="text"
          value={item.title}
        />
        <TextField
          id={buildId("value", i)}
          onChange={onChangeLabels}
          type="text"
          multiline
          value={item.value}
        />
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<RemoveIcon />}
          onClick={() => removeEditedLabel(i)}
        >
          Retirer
        </Button>
        <Divider vertical />
      </Grid>
    ) : (
      <Grid key={i}>
        <TextField
          id={buildId("item", i)}
          onChange={onChangeLabels}
          type="text"
          multiline
          value={item}
        />
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<RemoveIcon />}
          onClick={() => removeEditedLabel(i)}
        >
          Retirer
        </Button>
        <Divider vertical />
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Box
        border={1}
        style={{
          padding: "2px",
          margin: "5px",
          borderWidth: "1px",
          borderColor: "white",
          borderRadius: "15px",
        }}
      >
        <Grid
          container
          spacing={2}
          className={classes.root}
          justify={"flex-start"}
          alignItems={"center"}
        >
          <Grid item xs={12} sm={2}>
            <Box className={classes.labelTitle}>
              <Typography variant="h5">{title}</Typography>
            </Box>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={10}
            spacing={1}
            justify={"flex-start"}
            alignItems={"center"}
            style={{ outlineWidth: "thin", outlineColor: "white" }}
          >
            {dataCopy.length ? dataCopy.map(labelComponent) : labelComponent()}
            <Grid item xs={12} sm={4}>
              {readOnly ? (
                <></>
              ) : (
                <Box style={{ textAlign: "center", margin: "5px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<AddIcon />}
                    onClick={openEditDial}
                  >
                    Modifier
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>

          <Dialog
            open={editDial}
            onClose={closeEditDial}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Modification des {title}
            </DialogTitle>
            <DialogContent>
              {editedLabels.map(editableLabelComponent)}
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<AddIcon />}
                onClick={addEditedLabel}
              >
                Ajouter
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelEditDial} color="primary">
                Annuler
              </Button>
              <Button onClick={onSubmitLabels} color="primary">
                Enregistrer
              </Button>
              {loadingUpdateLabels && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </DialogActions>
          </Dialog>
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
