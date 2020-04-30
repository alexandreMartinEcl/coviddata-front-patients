import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/RemoveCircle";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Box, useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  rootBox: {
    padding: "2px",
    margin: "5px",
    borderWidth: "1px",
    borderColor: "white",
    borderRadius: "15px",
  },
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

const LabelComponent = ({
  labelVariant,
  item,
  variantLabelContent,
  classes,
  ...props
}) => {
  switch (labelVariant) {
    case "double":
      return (
        <Grid item xs={6} sm={4} key={item ? item.title : "Aucun"} {...props}>
          <Box className={classes.label}>
            <Grid
              container
              spacing={1}
              justify={"center"}
              alignContent="center"
            >
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
      );

    default:
      return (
        <Grid item xs={6} sm={4} key={item ? item : "Aucun"} {...props}>
          <Box className={classes.label}>
            <Typography variant={variantLabelContent}>
              {item ? item : "Aucun"}
            </Typography>
          </Box>
        </Grid>
      );
  }
};

const EditableLabelTexFields = ({
  labelVariant,
  item,
  index,
  onChangeLabels,
}) => {
  switch (labelVariant) {
    case "double":
      return (
        <React.Fragment>
          <TextField
            onChange={onChangeLabels(index)}
            type="text"
            value={item.title}
          />
          <TextField
            onChange={onChangeLabels(index)}
            type="text"
            multiline
            value={item.value}
          />
        </React.Fragment>
      );
    default:
      return (
        <TextField
          onChange={onChangeLabels(index)}
          type="text"
          multiline
          value={item}
        />
      );
  }
};

const EditableLabelComponent = ({
  labelVariant,
  item,
  index,
  classes,
  removeEditedLabel,
  onChangeLabels,
}) => (
  <Grid key={index}>
    <EditableLabelTexFields
      onChangeLabels={onChangeLabels}
      labelVariant={labelVariant}
      item={item}
      index={index}
    />
    <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<RemoveIcon />}
      onClick={() => removeEditedLabel(index)}
    >
      Retirer
    </Button>
    <Divider vertical />
  </Grid>
);

const DialActions = ({ onCancel, onSubmit, loading, classes }) => (
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

const LabelsDialog = ({
  title,
  content,
  addEditedLabel,
  actions,
  classes,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogTitle id="form-dialog-title">Modification des {title}</DialogTitle>
      <DialogContent>
        {content}
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
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

const EditButtonBox = ({ onClick, classes }) => (
  <Box style={{ textAlign: "center", margin: "5px" }}>
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      startIcon={<AddIcon />}
      onClick={onClick}
    >
      Modifier
    </Button>
  </Box>
);

const EditableLabels = ({
  editedLabels,
  labelVariant,
  variantLabelContent,
  removeEditedLabel,
  onChangeLabels,
  classes,
}) =>
  editedLabels.map((item, i) => (
    <EditableLabelComponent
      key={i}
      labelVariant={labelVariant}
      item={item}
      index={i}
      variantLabelContent={variantLabelContent}
      classes={classes}
      removeEditedLabel={removeEditedLabel}
      onChangeLabels={onChangeLabels}
    />
  ));

const Labels = ({ labels, labelVariant, variantLabelContent, classes }) =>
  labels.length ? (
    labels.map((item, i) => (
      <LabelComponent
        labelVariant={labelVariant}
        item={item}
        variantLabelContent={variantLabelContent}
        classes={classes}
        key={i}
      />
    ))
  ) : (
    <LabelComponent
      labelVariant={labelVariant}
      variantLabelContent={variantLabelContent}
      classes={classes}
    />
  );

const TitleBox = ({ title, classes }) => (
  <Box className={classes.labelTitle}>
    <Typography variant="h5">{title}</Typography>
  </Box>
);

const ListLabels = ({
  isEmpty,
  title,
  labelVariant,
  labels,
  readOnly,
  editedLabels,
  addEditedLabel,
  onChangeLabels,
  removeEditedLabel,
  dialOpen,
  openEditDial,
  closeEditDial,
  cancelEditDial,
  onSubmitLabels,
  loading,
}) => {
  const classes = useStyles();
  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantLabelContent = isUpSm ? "body1" : "body2";

  return (readOnly && isEmpty) || (
    <Box border={1} className={classes.rootBox}>
      <Grid container spacing={2} justify={"flex-start"} alignItems={"center"}>
        <Grid item xs={12} sm={2}>
          <TitleBox title={title} classes={classes} />
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={10}
          justify={"flex-start"}
          alignItems={"center"}
        >
          <Labels
            labels={labels}
            labelVariant={labelVariant}
            variantLabelContent={variantLabelContent}
            classes={classes}
          />
          <Grid item xs={6} sm={4}>
            {readOnly || (
              <EditButtonBox onClick={openEditDial} classes={classes} />
            )}
          </Grid>
        </Grid>

        <LabelsDialog
          title={title}
          editedLabels={editedLabels}
          addEditedLabel={addEditedLabel}
          open={dialOpen}
          onClose={closeEditDial}
          content={
            <EditableLabels
              editedLabels={editedLabels}
              labelVariant={labelVariant}
              variantLabelContent={variantLabelContent}
              removeEditedLabel={removeEditedLabel}
              onChangeLabels={onChangeLabels}
              classes={classes}
            />
          }
          actions={
            <DialActions
              onCancel={cancelEditDial}
              onSubmit={onSubmitLabels}
              loading={loading}
              classes={classes}
            />
          }
          classes={classes}
        />
      </Grid>
    </Box>
  );
};

ListLabels.propTypes = {
  isEmpty: PropTypes.bool,
  title: PropTypes.string.isRequired,
  labelVariant: PropTypes.oneOf(["double", "single"]),
  labels: PropTypes.array,
  readOnly: PropTypes.bool,
  editedLabels: PropTypes.array,
  addEditedLabel: PropTypes.func,
  onChangeLabels: PropTypes.func,
  removeEditedLabel: PropTypes.func,
  dialOpen: PropTypes.bool,
  openEditDial: PropTypes.func,
  closeEditDial: PropTypes.func,
  cancelEditDial: PropTypes.func,
  onSubmitLabels: PropTypes.func,
  loading: PropTypes.bool,
};

ListLabels.defaultProps = {
  isEmpty: false,
  labelVariant: "single",
  labels: [],
  readOnly: false,
  editedLabels: [],
  dialOpen: false,
  loading: false,
};

export default ListLabels;
