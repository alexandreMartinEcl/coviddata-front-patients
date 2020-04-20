import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import axios from "axios";
import config from "../../config";

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
import SaveIcon from "@material-ui/icons/Save";
import HistoryIcon from "@material-ui/icons/History";
import CancelIcon from "@material-ui/icons/Cancel";
import CircularProgress from "@material-ui/core/CircularProgress";

import { dateTimeToStr } from "../../shared/utils/date";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  column: {
    flexBasis: "33.33%",
  },
}));

export default function EditableText({
  patientId,
  title,
  extensibleElseDial = true,
  label,
  data = {},
  field,
  reFetch,
  readOnly,
}) {
  const classes = useStyles();
  const [editDial, setEditDial] = React.useState(false);

  const [savedText, setSavedText] = React.useState(data.text || "");
  const [text, setText] = React.useState(data.text || "");
  const [lastEdited, setLastEdited] = React.useState(
    dateTimeToStr(data.lastEdited)
  );

  const [loadingUpdateText, setLoadingUpdateText] = React.useState(false);

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

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const updateState = (resData) => {
    setSavedText(resData[field]);
    setText(resData[field]);
    setLastEdited(dateTimeToStr(resData[`last_edited_${field}`]));
  };

  const onSubmitTodoList = () => {
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
        updateState(res.data);
      })
      .catch((err) => {
        console.log(err);
        uiInform && uiInform(`La requête a échoué: ${err.toString()}`, false);
        setLoadingUpdateText(false);
      });
  };

  return extensibleElseDial ? (
    <React.Fragment>
      <Box style={{ margin: "1px", padding: "2px" }}>
        <ExpansionPanel defaultExpanded={false}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
            style={{ paddingLeft: "10px", paddingRight: "10px" }}
          >
            <Typography>{title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              margin="dense"
              id="todo_text"
              //            label={label}
              type="text"
              value={text}
              fullWidth
              onChange={onChangeText}
              disabled={readOnly}
              multiline
              variant="outlined"
            />
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <div className={classes.column}>
              <Typography>
                Mise à jour: {lastEdited || data.lastEdited}
              </Typography>
            </div>
            {readOnly ? (
              <></>
            ) : (
              <React.Fragment>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={cancelEditDial}
                >
                  Rétablir
                </Button>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={onSubmitTodoList}
                >
                  Enregistrer
                </Button>
              </React.Fragment>
            )}
          </ExpansionPanelActions>
        </ExpansionPanel>
      </Box>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
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
            disabled={readOnly}
            multiline
            variant="outlined"
          />
          Mise à jour: {lastEdited || data.lastEdited}
        </DialogContent>
        {readOnly ? (
          <></>
        ) : (
          <DialogActions>
            <Button
              onClick={cancelEditDial}
              color="primary"
              variant="outlined"
              startIcon={<CancelIcon />}
            >
              Annuler
            </Button>
            <Button
              onClick={onSubmitTodoList}
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Enregistrer
            </Button>
            {loadingUpdateText && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </DialogActions>
        )}
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
    </React.Fragment>
  );
}
