import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import axios from "axios";
import config from "../config";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { dateTimeToStr } from "../shared/utils/date";

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

export default function EditableText({
  patientId,
  title,
  extensibleElseDial = true,
  label,
  data = {},
  field,
}) {
  const classes = useStyles();
  const [editDial, setEditDial] = React.useState(false);

  const [savedText, setSavedText] = React.useState(data.text || "");
  const [text, setText] = React.useState(data.text || "");
  const [lastEdited, setLastEdited] = React.useState(
    dateTimeToStr(data.lastEdited)
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [loadingUpdateText, setLoadingUpdateText] = React.useState(false);

  const closeEditDial = () => {
    setEditDial(false);
  };

  const cancelEditDial = () => {
    setText(savedText);
    closeEditDial();
  };

  const openEditDial = () => {
    setEditDial(true);
  };

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
  };

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmitTodoList = () => {
    setSavedText(text);
    let d = dateTimeToStr(new Date());
    setLastEdited(d);

    setLoadingUpdateText(true);

    const formData = new FormData();
    formData.append(field, text);

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
        setLoadingUpdateText(false);
        closeEditDial();
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.toString());
        setSnackbarOpen(true);
        setLoadingUpdateText(false);
      });
  };

  return extensibleElseDial ? (
    <div className={classes.root}>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>{title}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <TextField
            margin="dense"
            id="todo_text"
            //            label={label}
            type="text"
            value={text}
            fullWidth
            onChange={onChangeText}
            multiline
          />
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <div className={classes.column}>
            <Typography className={classes.heading}>
              Dernière mise à jour: <br />
              {lastEdited || data.lastEdited}
            </Typography>
          </div>
          <Button size="small" onClick={cancelEditDial}>
            Rétablir
          </Button>
          <Button size="small" color="primary" onClick={onSubmitTodoList}>
            Enregistrer
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
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
  ) : (
    <div className={classes.root}>
      <Button
        color="secondary"
        onClick={openEditDial}
        startIcon={<FormatListNumberedIcon />}
      >
        Todo list
      </Button>
      <Dialog
        open={editDial}
        onClose={closeEditDial}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="textField"
            label={label}
            type="text"
            value={text}
            fullWidth
            onChange={onChangeText}
            multiline
          />
          Dernière mise à jour: {lastEdited || data.lastEdited}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEditDial} color="primary">
            Annuler
          </Button>
          <Button onClick={onSubmitTodoList} color="primary">
            Enregistrer
          </Button>
          {loadingUpdateText && (
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
