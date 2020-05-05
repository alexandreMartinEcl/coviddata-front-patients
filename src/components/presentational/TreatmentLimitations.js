import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  Grid,
  Box,
  TextField,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  rootBox: {
    padding: "2px",
    margin: "15px",
    backgroundColor: "white",
    borderRadius: "15px",
  },
  boldHeader: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  italicComplement: {
    fontStyle: "italic",
    marginLeft: "5px",
  },
  cellBox: {
    margin: "2px",
    padding: "2px",
    borderWidth: "1px",
    borderColor: "#CAF1EC",
    borderRadius: "10px",
  },
}));

const LATDialog = ({
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

const LATActions = ({ onCancel, onSubmit, loading, changeCheck, classes }) =>
  changeCheck && (
    <Grid container justify="space-around" space={1}>
      <Grid item xs={5}>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          startIcon={<CancelIcon />}
          style={{ margin: "2px" }}
          onClick={onCancel}
        >
          Annuler
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

const Content = ({ readOnly, inputs, onChange, handleKeyPress }) => {
  return inputs.map((inputSet) => {
    if (
      inputSet.title &&
      inputSet.inputs.filter((i) => !readOnly || i.value).length
    ) {
      return (
        <React.Fragment>
          <Typography variant="h4">{inputSet.title}</Typography>
          {inputSet.inputs
            .filter((i) => !readOnly || i.value)
            .map((input) => (
              <React.Fragment>
                {input.isCheckbox ? (
                  <FormControlLabel
                    key={input.field}
                    disabled={readOnly}
                    control={
                      <Checkbox
                        name={input.field}
                        checked={input.value}
                        style={{ padding: "1px", paddingLeft: "9px" }}
                        onChange={onChange(input.field, input.isCheckbox)}
                      />
                    }
                    label={input.label}
                  />
                ) : (
                  <FormControlLabel
                    key={input.field}
                    disabled={readOnly}
                    control={
                      <TextField
                        key={input.field}
                        margin="dense"
                        type="text"
                        value={input.value}
                        onChange={onChange(input.field, input.isCheckbox)}
                        onKeyPress={handleKeyPress}
                        disabled={readOnly}
                        // multiline
                        variant="outlined"
                        // label={input.label || null}
                      />
                    }
                    label={input.label}
                    labelPlacement="start"
                  />
                )}
                <br />
              </React.Fragment>
            ))}
        </React.Fragment>
      );
    }
    return <></>;
  });
};

const TreatmentLimitationsPresentational = ({
  readOnly,
  strLastEdited,
  inputs,
  onChange,
  handleKeyPress,
  cancelDial,
  closeDial,
  openDial,
  onSubmit,
  loading,
  open,
  customButton,
  badgeCount,
  buttonIcon,
  changeCheck,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <OpenButton
        customButton={customButton}
        buttonIcon={buttonIcon}
        label={"LAT"}
        badgeCount={badgeCount}
        onClick={openDial}
      />
      <LATDialog
        title={"LAT"}
        details={"Limitation des traitements"}
        updateDate={strLastEdited}
        readOnly={readOnly}
        classes={classes}
        content={
          <Content
            readOnly={readOnly}
            inputs={inputs}
            onChange={onChange}
            handleKeyPress={handleKeyPress}
          />
        }
        actions={
          <LATActions
            onCancel={cancelDial}
            onSubmit={onSubmit}
            loading={loading}
            variant="cancel"
            changeCheck={changeCheck}
            classes={classes}
          />
        }
        open={open}
        onClose={closeDial}
      />
    </React.Fragment>
  );
};

TreatmentLimitationsPresentational.propTypes = {
  readOnly: PropTypes.bool,
  strLastEdited: PropTypes.string,
  inputs: PropTypes.array,
  onChange: PropTypes.func,
  handleKeyPress: PropTypes.func,
  cancelDial: PropTypes.func,
  closeDial: PropTypes.func,
  openDial: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  open: PropTypes.bool,
  customButton: PropTypes.func,
  badgeCount: PropTypes.number,
  buttonIcon: PropTypes.element,
  changeCheck: PropTypes.bool,
};

TreatmentLimitationsPresentational.defaultProps = {
  bedInfo: "",
  isEditable: false,
  sexInterface: {},
  readOnly: false,
  typoVariant: "body2",
  loading: false,
};

export default TreatmentLimitationsPresentational;
