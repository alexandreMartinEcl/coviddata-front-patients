import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/FormatListNumbered";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import axios from "axios";
import config from "../config";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
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

export default function ListLabels({
  patientId,
  title,
  doubleInfoElseSingle = false,
  field,
  data = {},
}) {
  const classes = useStyles();
  const [editDial, setEditDial] = React.useState(false);
  const [savedLabels, setSavedLabels] = React.useState([]);
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data.listItems));
  const [editedLabels, setEditedLabels] = React.useState(
    _.cloneDeep(data.listItems)
  );
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [loadingUpdateLabels, setLoadingUpdateLabels] = React.useState(false);

  const closeEditDial = () => {
    setEditDial(false);
  };

  const cancelEditDial = () => {
    setEditedLabels(_.cloneDeep(savedLabels));
    closeEditDial();
  };

  const openEditDial = () => {
    setEditDial(true);
    setSavedLabels(_.cloneDeep(dataCopy));
  };

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
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

  const onSubmitLabels = () => {
    let tempLabels = doubleInfoElseSingle
      ? editedLabels.filter((i) => i.title.trim())
      : editedLabels.filter((i) => i.trim());
    setDataCopy(_.cloneDeep(tempLabels));
    setEditedLabels(_.cloneDeep(tempLabels));
    setSavedLabels([]);

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
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.toString());
        setSnackbarOpen(true);
        setLoadingUpdateLabels(false);
      });
  };

  const labelComponent = (item, i) => {
    return doubleInfoElseSingle ? (
      <Grid>
        <Paper>
          <Typography>{item.title}</Typography>
          <Divider vertical />
          <Typography>{item.value}</Typography>
        </Paper>
      </Grid>
    ) : (
      <Grid>
        <Paper>
          <Typography>{item}</Typography>
        </Paper>
      </Grid>
    );
  };

  const editableLabelComponent = (item, i) => {
    return doubleInfoElseSingle ? (
      <Grid>
        <Paper>
          <div>
            <TextField
              id={buildId("title", i)}
              onChange={onChangeLabels}
              type="text"
              value={item.title}
            />
            <Divider vertical />
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
          </div>
        </Paper>
      </Grid>
    ) : (
      <Grid>
        <Paper>
          <div>
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
          </div>
        </Paper>
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      {dataCopy.map(labelComponent)}
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={openEditDial}
      >
        Modifier
      </Button>
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
          severity="error"
        >
          La requête a échoué {errMsg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
