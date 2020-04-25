import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import config from "../../config";

import ReactMarkdown from "react-markdown";
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
import HistoryIcon from "@material-ui/icons/History";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CircularProgress from "@material-ui/core/CircularProgress";

import { dateTimeToStr } from "../../shared/utils/date";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Box, Grid, Badge } from "@material-ui/core";
import { manageError } from "../../shared/utils/tools";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  column: {
    flexBasis: "33.33%",
  },
  dialogMarkdownBox: {
    borderColor: theme.palette.secondary.light,
    borderRadius: "10px",
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
  buttonIcon,
  customButton,
  withMarkdown = false,
  badgeCounter,
  defaultNewLine = "",
  defaultText = "",
  readOnly,
}) {
  const classes = useStyles();
  const [editDial, setEditDial] = React.useState(false);
  const [badgeCount, setBadgeCount] = React.useState(null);

  const [savedText, setSavedText] = React.useState(data.text || "");
  const [text, setText] = React.useState(data.text || "");
  const [lastEdited, setLastEdited] = React.useState(
    dateTimeToStr(data.lastEdited)
  );

  const [loadingUpdateText, setLoadingUpdateText] = React.useState(false);

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

  const OpenButton = (props) => {
    let SimpleButton = customButton
      ? customButton
      : (_props) => (
          <Button
            color="primary"
            variant="contained"
            startIcon={buttonIcon}
            {..._props}
          >
            {title}
          </Button>
        );
    return badgeCount ? (
      <Badge color="secondary" badgeContent={badgeCount}>
        <SimpleButton {...props} />
      </Badge>
    ) : (
      <SimpleButton {...props} />
    );
  };

  /**
   *
   * @param {KeyboardEvent} event
   */
  const handleKeyPress = (event) => {
    switch (event.key) {
      case "Enter":
        let txt = event.target.value;
        let selectionStart = event.target.selectionStart;

        txt =
          txt.slice(0, event.target.selectionStart) +
          defaultNewLine +
          txt.slice(event.target.selectionEnd);
        event.target.value = txt;
        onChangeText(event);

        event.target.selectionStart = selectionStart + defaultNewLine.length;
        event.target.selectionEnd = event.target.selectionStart;
        //TODO this will prevent UNDO step (if we do Ctrl+z after this event, will not undo it)
        event.preventDefault();
        break;
      default:
        return;
    }
  };

  const updateState = (resData) => {
    setSavedText(resData[field]);
    setText(resData[field]);
    buildBadgeCount(resData[field]);
    setLastEdited(dateTimeToStr(resData[`last_edited_${field}`]));
  };

  const buildBadgeCount = (str) => {
    if (!badgeCounter) return;

    setBadgeCount(badgeCounter(str));
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
        setLoadingUpdateText(false);
        manageError(err.response, uiInform);
      });
  };

  (badgeCounter && badgeCount !== null) || buildBadgeCount(text);
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
            <Grid container>
              {(!readOnly || !withMarkdown) && (
                <Grid item xs={12} sm={withMarkdown ? 6 : 12}>
                  <TextField
                    margin="dense"
                    id="todo_text"
                    //            label={label}
                    type="text"
                    value={text || defaultText}
                    fullWidth
                    onChange={onChangeText}
                    onKeyPress={
                      defaultNewLine
                        ? handleKeyPress
                        : () => {
                            return;
                          }
                    }
                    disabled={readOnly}
                    multiline
                    variant="outlined"
                  />
                </Grid>
              )}
              {withMarkdown && (
                <Grid item xs={12} sm={readOnly ? 12 : 6}>
                  <ReactMarkdown source={text || defaultText} />
                </Grid>
              )}
            </Grid>
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
      <OpenButton onClick={openEditDial} />
      <Dialog open={editDial} onClose={closeEditDial} maxWidth="lg">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Grid container>
            {(!readOnly || !withMarkdown) && (
              <Grid item xs={12} sm={withMarkdown ? 6 : 12}>
                <TextField
                  margin="dense"
                  id="textField"
                  label={title}
                  type="text"
                  value={text || defaultText}
                  fullWidth
                  onChange={onChangeText}
                  onKeyPress={
                    defaultNewLine
                      ? handleKeyPress
                      : () => {
                          return;
                        }
                  }
                  disabled={readOnly}
                  multiline
                  variant="outlined"
                />
              </Grid>
            )}
            {withMarkdown && (
              <Grid item xs={12} sm={readOnly ? 12 : 6}>
                <Box border={1} className={classes.dialogMarkdownBox}>
                  <ReactMarkdown source={text || defaultText} />
                </Box>
              </Grid>
            )}
          </Grid>
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
