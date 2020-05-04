import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { getAge, dateToDayStep } from "../../shared/utils/date";
import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  ExpansionPanelDetails,
  ExpansionPanel,
  ExpansionPanelSummary,
  Box,
} from "@material-ui/core";
import { FormDialog } from "../Form";
import MovePatientIcon from "../../shared/icons/move_patient";
import { TodoListIcon } from "../../shared/icons";

const useStyles = makeStyles((theme) => ({
  bedItem: {
    height: "60px",
    // margin: "2px",
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
    width: "10%",
    maxWidth: "40px",
  },
  patientDetails: {
    width: "30%",
    maxWidth: "300px",
  },
  otherDetails: {
    width: "30%",
    maxWidth: "300px",
    primary: {
      fontSize: "1px",
    },
  },
  thirdDetails: {
    paddingRight: "80px",
    width: "30%",
    maxWidth: "300px",
  },
  failuresGrid: {
    // width: "20%",
    // maxWidth: "120px"
  },
  failureIcon: {
    width: "30px",
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "15px",
      maxWidth: "15px",
      height: "15px",
    },
  },
  listItemSecAction: {
    width: "50%",
    maxWidth: "150px",
  },
  actionIcon: {
    width: "30px",
    height: "30px",
  },
  buttonProgress: {
    color: "#60E73C",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  expansionSummary: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
}));

const getSeverityClass = (patient, classes) => {
  switch (patient.severity) {
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

const displayName = (patient) => {
  return `${patient.firstName} ${patient.lastName}${
    patient.sex ? ` (${patient.sex})` : ""
  }`;
};

const getPatientAge = (patient) => {
  return patient.birthDate ? `${getAge(patient.birthDate)} ans` : "";
};

const getDateToDayStep = (stay) => {
  return `${dateToDayStep(stay.startDate)}`;
};

const UnitBedPatientProps = {
  id: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  sex: PropTypes.string,
  severity: PropTypes.string,
  birthDate: PropTypes.instanceOf(Date),
  hospitalisationCause: PropTypes.string,
};

const UnitBedPatientStayProps = {
  id: PropTypes.number,
  startDate: PropTypes.instanceOf(Date),
};

const AddActions = ({
  onCancel,
  addPatient,
  changeFullForm,
  fullForm,
  loading,
  classes,
}) => (
  <React.Fragment>
    <Button onClick={changeFullForm} variant="outlined" color="secondary">
      {fullForm ? "Réduire" : "Détails"}
    </Button>
    <Button onClick={onCancel} variant="outlined" color="primary">
      Annuler
    </Button>
    {/* <Input type='submit'> */}
    <Button
      type="submit"
      onClick={addPatient}
      variant="contained"
      color="primary"
    >
      {fullForm ? "Ajouter" : "Ajouter et ouvrir"}
    </Button>
    {/* </Input> */}
    {loading && (
      <CircularProgress size={24} className={classes.buttonProgress} />
    )}
  </React.Fragment>
);

export const UnitBedDialog = ({
  patient,
  changeFullForm,
  fullForm,
  onCancel,
  removePatientFromBed,
  addPatient,
  loading,
  formProps,
  ...props
}) => {
  const classes = useStyles();

  return patient ? (
    <Dialog {...props}>
      <DialogContent>
        Êtes-vous sûr de vouloir retirer le patient: {displayName(patient)} ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={removePatientFromBed}
          color="primary"
          variant="contained"
        >
          Retirer le patient
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </DialogActions>
    </Dialog>
  ) : (
    <FormDialog
      formProps={{
        liveValidate: true,
        ...formProps,
      }}
      actions={
        <AddActions
          onCancel={onCancel}
          addPatient={addPatient}
          changeFullForm={changeFullForm}
          fullForm={fullForm}
          loading={loading}
          classes={classes}
        />
      }
      {...props}
    />
  );
};

UnitBedDialog.propTypes = {
  patient: PropTypes.shape(UnitBedPatientProps),
  addPatient: PropTypes.func,
  handleDialCancel: PropTypes.func,
  removePatientFromBed: PropTypes.func,
  loading: PropTypes.bool,
  formProps: PropTypes.object,
  fullForm: PropTypes.bool,
  changeFullForm: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

UnitBedDialog.defaultProps = {
  dialOpen: false,
  loading: false,
  fullForm: false,
};

const EmptyBed = ({
  bedId,
  handleDialOpen,
  unitIndex,
  bedStatus,
  variantForBedItem,
  classes,
}) => (
  <ListItem
    key={bedId}
    role={undefined}
    button
    className={classes.bedItem}
    onClick={() => handleDialOpen(bedId)}
  >
    <ListItemText primary={unitIndex} className={classes.bedIndex} />
    <ListItemText
      primary={bedStatus}
      className={classes.patientDetails}
      primaryTypographyProps={{ variant: variantForBedItem }}
    />
    <ListItemText primary={""} className={classes.otherDetails} />
    <ListItemSecondaryAction className={classes.listItemSecAction}>
      <IconButton onClick={() => handleDialOpen(bedId)} color="secondary">
        <AddIcon fontSize="large" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const FailuresIconsGrids = ({ failuresIcons, classes }) => {
  return (
    !failuresIcons.length || (
      <Grid
        container
        spacing={2}
        justify="flex-start"
        className={classes.failuresGrid}
      >
        {failuresIcons.map((MyIcon, i) => (
          <Grid key={i} item xs={4} sm>
            <MyIcon color="primary" className={classes.failureIcon} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

const GardePatientBed = ({
  severityClass,
  bedId,
  unitIndex,
  displayedName,
  dateToDayStep,
  failuresIcons,
  TodoList,
  classes,
}) => (
  <Box style={{ margin: "1px", padding: "2px" }}>
    <ExpansionPanel key={bedId} defaultExpanded>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={`${severityClass} ${classes.expansionSummary}`}
      >
        <Grid container>
          <Grid item xs>
            {unitIndex}
          </Grid>
          <Grid item xs>
            {displayedName}
          </Grid>
          <Grid item xs>
            {dateToDayStep}
          </Grid>
          <Grid item xs>
            <FailuresIconsGrids
              failuresIcons={failuresIcons}
              classes={classes}
            />
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <TodoList />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </Box>
);

const BasicPatientBed = ({
  severityClass,
  bedId,
  unitIndex,
  displayedName,
  birthDateAndAge,
  variantForBedItem,
  dateToDayStep,
  hospitalisationCause,
  failuresIcons,
  patientId,
  stayId,
  TodoListIcon,
  handlePatientClick,
  handleDialOpen,
  onSwap,
  classes,
}) => (
  <ListItem
    key={bedId}
    button
    className={severityClass}
    onClick={() => handlePatientClick(patientId)}
  >
    <ListItemText primary={unitIndex} className={classes.bedIndex} />

    <ListItemText
      primary={displayedName}
      secondary={birthDateAndAge}
      className={classes.patientDetails}
      primaryTypographyProps={{ variant: variantForBedItem }}
      secondaryTypographyProps={{ variant: variantForBedItem }}
    />
    <ListItemText
      primary={dateToDayStep}
      secondary={hospitalisationCause}
      className={classes.otherDetails}
      primaryTypographyProps={{ variant: variantForBedItem }}
      secondaryTypographyProps={{ variant: variantForBedItem }}
    />
    <ListItemText
      primary={
        <FailuresIconsGrids failuresIcons={failuresIcons} classes={classes} />
      }
      className={classes.thirdDetails}
      primaryTypographyProps={{ variant: variantForBedItem }}
      secondaryTypographyProps={{ variant: variantForBedItem }}
    />
    <ListItemSecondaryAction className={classes.listItemSecAction}>
      <TodoListIcon color="secondary" className={classes.actionIcon} />
      <IconButton onClick={onSwap} color="secondary">
        <MovePatientIcon className={classes.actionIcon} />
      </IconButton>
      <IconButton
        onClick={() => handleDialOpen(stayId, displayedName)}
        color="primary"
      >
        <RemoveIcon fontSize="large" className={classes.actionIcon} />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const PatientBed = ({ gardeMode, buildTodoList, ...props }) =>
  gardeMode ? (
    <GardePatientBed TodoList={buildTodoList("")} {...props} />
  ) : (
    <BasicPatientBed TodoListIcon={buildTodoList("dial")} {...props} />
  );
export const UnitBedPresentational = ({
  bedId,
  unitIndex,
  patient,
  variantForBedItem,
  failuresIcons,
  patientStay,
  buildTodoList,
  bedStatus,
  handlePatientClick,
  handleDialOpen,
  onSwapPatient,
  gardeMode,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      {patient ? (
        <PatientBed
          severityClass={getSeverityClass(patient, classes)}
          bedId={bedId}
          unitIndex={unitIndex}
          displayedName={displayName(patient)}
          birthDateAndAge={getPatientAge(patient)}
          variantForBedItem={variantForBedItem}
          dateToDayStep={getDateToDayStep(patientStay)}
          hospitalisationCause={patient.hospitalisationCause}
          failuresIcons={failuresIcons}
          patientId={patient.id}
          stayId={patientStay.id}
          buildTodoList={buildTodoList}
          handlePatientClick={handlePatientClick}
          handleDialOpen={handleDialOpen}
          onSwap={onSwapPatient(patient, patientStay)}
          classes={classes}
          gardeMode={gardeMode}
        />
      ) : gardeMode ? (
        <></>
      ) : (
        <EmptyBed
          bedId={bedId}
          handleDialOpen={handleDialOpen}
          unitIndex={unitIndex}
          bedStatus={bedStatus}
          variantForBedItem={variantForBedItem}
          classes={classes}
        />
      )}
    </React.Fragment>
  );
};

UnitBedPresentational.propTypes = {
  patient: PropTypes.shape(UnitBedPatientProps),
  patientStay: PropTypes.shape(UnitBedPatientStayProps),
  bedId: PropTypes.number.isRequired,
  unitIndex: PropTypes.number.isRequired,
  variantForBedItem: PropTypes.string,
  failuresIcons: PropTypes.array,
  buildTodoList: PropTypes.func,
  bedStatus: PropTypes.oneOf(["Libre", "Indisponible"]),
  handlePatientClick: PropTypes.func,
  handleDialOpen: PropTypes.func,
  onSwapPatient: PropTypes.func,
  gardeMode: PropTypes.bool,
};

UnitBedPresentational.defaultProps = {
  gardeMode: false,
};
