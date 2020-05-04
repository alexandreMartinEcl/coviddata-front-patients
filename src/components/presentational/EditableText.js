import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";

import ReactMarkdown from "react-markdown";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HistoryIcon from "@material-ui/icons/History";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  Box,
  Grid,
  Badge,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";

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

const TextDialog = ({
  title,
  details,
  content,
  updateDate,
  readOnly,
  interpretorVariant,
  actions,
  classes,
  ...props
}) => {
  let alwaysAllowSubmit = ["checklist"].find((v) => v === interpretorVariant);
  return (
    <Dialog {...props} maxWidth="lg">
      <DialogTitle id="form-dialog-title">{details || title}</DialogTitle>
      <DialogContent>
        Mise à jour: {updateDate}
        {content}
      </DialogContent>
      <DialogActions>
        {(!readOnly || alwaysAllowSubmit) && actions}
      </DialogActions>
    </Dialog>
  );
};

const TextExpansionPanel = ({
  title,
  content,
  updateDate,
  readOnly,
  actions,
  onOpen,
  onClose,
  expanded,
  classes,
  ...props
}) => (
  <ExpansionPanel
    expanded={expanded}
    onChange={(e, expanded) => (expanded ? onOpen() : onClose())}
    {...props}
  >
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1c-content"
      id="panel1c-header"
      style={{ paddingLeft: "10px", paddingRight: "10px" }}
    >
      <Typography>{title}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>{content}</ExpansionPanelDetails>
    <ExpansionPanelActions>
      <div className={classes.column}>
        <Typography>Mise à jour: {updateDate}</Typography>
      </div>
      {readOnly || actions}
    </ExpansionPanelActions>
  </ExpansionPanel>
);

const TextActions = ({
  variant,
  onCancel,
  onSubmit,
  loading,
  changeCheck,
  classes,
}) =>
  changeCheck && (
    <Grid container justify="space-around" space={1}>
      <Grid item xs={5}>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          startIcon={variant === "restore" ? <HistoryIcon /> : <CancelIcon />}
          style={{ margin: "2px" }}
          onClick={onCancel}
        >
          {variant === "restore" ? "Rétablir" : "Annuler"}
        </Button>
      </Grid>
      <Grid item xs={7}>
        <Button
          size="small"
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
          style={{ margin: "2px" }}
          onClick={onSubmit}
        >
          Enregistrer
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </Grid>
    </Grid>
  );

TextActions.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  classes: PropTypes.object,
  variant: PropTypes.oneOf(["cancel", "restore"]),
  changeCheck: PropTypes.bool,
};

TextActions.defaultProps = {
  onCancel: () => {},
  onSubmit: () => {},
  loading: false,
  classes: {},
  variant: "cancel",
  changeCheck: false,
};

const MarkdownToCheckList = ({ text, onChange }) => {
  let regexCheckRow = /- \[[ x]\].*/g;
  let regexChecked = /- \[x\].*/g;
  let values = text.split(`\n`).map((row, i) =>
    !row.match(regexCheckRow)
      ? null
      : {
          id: i,
          label: (row.match(regexChecked)
            ? row.split("[x]")[1]
            : row.split("[ ]")[1]
          ).trim(),
          value: row.match(regexChecked),
        }
  );

  return values.map(
    (val) =>
      val && (
        <React.Fragment>
          <FormControlLabel
            key={val.id}
            control={
              <Checkbox
                name={val.label}
                checked={val.value}
                style={{ padding: "1px", paddingLeft: "9px" }}
                onChange={onChange(val.id)}
              />
            }
            label={val.label}
          />
          <br />
        </React.Fragment>
      )
  );
};

const Content = ({
  interpretorVariant,
  label,
  readOnly,
  text,
  onChange,
  handleKeyPress,
  onChangeCheckList,
  autoFocus,
}) => {
  let readOnlyScreen = ["checklist", "markdown"].find(
    (v) => v === interpretorVariant
  );

  return (
    <Grid container>
      {(!readOnly || !readOnlyScreen) && (
        <Grid item xs={12} sm={readOnlyScreen ? 6 : 12}>
          <TextField
            margin="dense"
            id="textField"
            type="text"
            value={text}
            fullWidth
            onChange={onChange}
            onKeyPress={handleKeyPress}
            disabled={readOnly}
            autoFocus={autoFocus}
            multiline
            variant="outlined"
            label={label || null}
          />
        </Grid>
      )}
      {readOnlyScreen && (
        <Grid item xs={12} sm={readOnly ? 12 : 6}>
          {interpretorVariant === "checklist" && (
            <MarkdownToCheckList text={text} onChange={onChangeCheckList} />
          )}
          {interpretorVariant === "markdown" && <ReactMarkdown source={text} />}
        </Grid>
      )}
    </Grid>
  );
};

Content.propTypes = {
  interpretorVariant: PropTypes.oneOf(["markdown", "checklist", "none"]),
  readOnly: PropTypes.bool,
  text: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  handleKeyPress: PropTypes.func,
};

const OpenButton = ({
  customButton,
  buttonIcon,
  label,
  badgeCount,
  ...props
}) => {
  let SimpleButton = customButton
    ? customButton
    : (_props) => (
        <Button
          color="primary"
          variant="contained"
          startIcon={buttonIcon}
          {..._props}
        >
          {label}
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

const EditableText = ({
  title,
  details,
  variant,
  interpretorVariant,
  readOnly,
  strLastEdited,
  text,
  onChangeText,
  handleKeyPress,
  cancelEditDial,
  onSubmitText,
  loadingUpdateText,
  openText,
  open,
  closeEditDial,
  customButton,
  badgeCount,
  buttonIcon,
  onChangeCheckList,
  changeCheck,
  autoFocus,
}) => {
  const classes = useStyles();
  switch (variant) {
    case "dial":
      return (
        <React.Fragment>
          <OpenButton
            customButton={customButton}
            buttonIcon={buttonIcon}
            label={title}
            badgeCount={badgeCount}
            onClick={openText}
          />
          <TextDialog
            title={title}
            details={details}
            updateDate={strLastEdited}
            readOnly={readOnly}
            interpretorVariant={interpretorVariant}
            classes={classes}
            content={
              <Content
                interpretorVariant={interpretorVariant}
                readOnly={readOnly}
                text={text}
                onChange={onChangeText}
                handleKeyPress={handleKeyPress}
                onChangeCheckList={onChangeCheckList}
                autoFocus={autoFocus}
              />
            }
            actions={
              <TextActions
                onCancel={cancelEditDial}
                onSubmit={onSubmitText}
                loading={loadingUpdateText}
                variant="cancel"
                changeCheck={changeCheck}
                classes={classes}
              />
            }
            open={open}
            onClose={closeEditDial}
          />
        </React.Fragment>
      );
    case "extensible":
      return (
        <Box style={{ margin: "1px", padding: "2px" }}>
          <TextExpansionPanel
            title={title}
            updateDate={strLastEdited}
            expanded={open}
            onOpen={openText}
            onClose={closeEditDial}
            readOnly={readOnly}
            classes={classes}
            content={
              <Content
                interpretorVariant={interpretorVariant}
                readOnly={readOnly}
                text={text}
                onChange={onChangeText}
                handleKeyPress={handleKeyPress}
                autoFocus={autoFocus}
              />
            }
            actions={
              <TextActions
                changeCheck={changeCheck}
                onCancel={cancelEditDial}
                onSubmit={onSubmitText}
                loading={loadingUpdateText}
                variant="restore"
                classes={classes}
              />
            }
          />
        </Box>
      );
    default:
      return (
        <React.Fragment>
          <Content
            interpretorVariant={interpretorVariant}
            readOnly={readOnly}
            text={text}
            onChange={onChangeText}
            handleKeyPress={handleKeyPress}
            onChangeCheckList={onChangeCheckList}
            autoFocus={autoFocus}
          />
          <br />
          <TextActions
            onCancel={cancelEditDial}
            onSubmit={onSubmitText}
            loading={loadingUpdateText}
            variant="cancel"
            changeCheck={changeCheck}
            classes={classes}
          />
        </React.Fragment>
      );
  }
};

EditableText.propTypes = {
  title: PropTypes.string,
  details: PropTypes.string,
  variant: PropTypes.oneOf(["extensible", "dial", ""]),
  interpretorVariant: PropTypes.oneOf(["markdown", "checklist", "none"]),
  readOnly: PropTypes.bool,
  strLastEdited: PropTypes.string,
  text: PropTypes.string,
  onChangeText: PropTypes.func,
  handleKeyPress: PropTypes.func,
  cancelEditDial: PropTypes.func,
  onSubmitText: PropTypes.func,
  loadingUpdateText: PropTypes.bool,
  openText: PropTypes.func,
  open: PropTypes.bool,
  closeEditDial: PropTypes.func,
  customButton: PropTypes.func,
  badgeCount: PropTypes.number,
  buttonIcon: PropTypes.element,
  changeCheck: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

EditableText.defaultProps = {
  variant: "",
  interpretorVariant: "none",
  readOnly: false,
  strLastEdited: "",
  text: "",
  loadingUpdateText: false,
  open: false,
  badgeCount: 0,
  changeCheck: false,
  autoFocus: false,
};

export default EditableText;
