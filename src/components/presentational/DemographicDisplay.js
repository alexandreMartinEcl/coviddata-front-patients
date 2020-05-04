import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/AddCircle";
import HistoryIcon from "@material-ui/icons/History";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Grid, Box, Select, MenuItem, TextField } from "@material-ui/core";
import { dateToDayStep } from "../../shared/utils/date";

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

const buildBedInfo = (unitStay) => {
  // bed_description is like '1 - Lit 1 - Unité Sirrocco (Réanimation Rea1 - Hôpital Lariboisière) (1234)'
  if (!unitStay) return "A quitté la réanimation";
  let [, bedIndex, unitPart1, unitPart2] = unitStay.bed_description.split(
    " - "
  );
  unitPart2 = unitPart2.split(") (")[0] + ")";
  return `${[bedIndex, unitPart1, unitPart2].join(" - ")}`;
};

const Actions = ({ onCancel, onSubmit, loading, classes }) => (
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

const EditableDataCell = ({
  dataType,
  variant,
  multiline,
  value,
  infoToAdd,
  label,
  onDoubleClick,
  ...props
}) => {
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

const FixedDataCell = ({
  dataType,
  variant,
  multiline,
  value,
  infoToAdd,
  label,
  onDoubleClick,
  classes,
  ...props
}) => {
  return (
    <Box border={1} onDoubleClick={onDoubleClick} className={classes.cellBox}>
      <Grid container spacing={1}>
        <Typography variant={variant} className={classes.boldHeader} {...props}>
          {label}:{" "}
        </Typography>
        <Typography variant={variant} {...props}>
          {value}
        </Typography>
        <Typography
          variant={variant}
          className={classes.italicComplement}
          {...props}
        >
          {infoToAdd}
        </Typography>
      </Grid>
    </Box>
  );
};

const DataCell = ({ editable, ...props }) => {
  return editable ? (
    <EditableDataCell {...props} />
  ) : (
      <FixedDataCell {...props} />
    );
};

const DemographicDisplay = ({
  unitStay,
  hospitalisationDate,
  isEditable,
  nipId,
  familyName,
  firstName,
  sex,
  sexInterface,
  birthDate,
  toAddBirthDate,
  weight,
  size,
  toAddSize,
  hospitalisationCause,
  cellFocus,
  readOnly,
  variantHeaderContent,
  onFieldChange,
  handleKeyPress,
  makeEditable,
  onCancel,
  onSubmit,
  loading,
}) => {
  const classes = useStyles();

  const MyDataCell = ({ field, label, ...props }) => (
    <DataCell
      classes={classes}
      label={label}
      editable={isEditable}
      variant={variantHeaderContent}
      autoFocus={cellFocus === field}
      onChange={onFieldChange(field)}
      onKeyDown={handleKeyPress}
      onDoubleClick={() => {
        makeEditable && makeEditable(field);
      }}
      {...props}
    />
  );

  return (
    <React.Fragment>
      <Box className={classes.rootBox}>
        <Grid container space={2}>
          <Typography variant="h6">Séjour</Typography>
          <Grid item xs={12} sm={12}>
            <DataCell
              classes={classes}
              value={buildBedInfo(unitStay)}
              variant={variantHeaderContent}
              editable={false}
              label="Situation"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <MyDataCell
              field="hospitalisation_cause"
              label="Motif d'admission"
              dataType={{ valueType: "string" }}
              value={hospitalisationCause}
              multiline
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <MyDataCell
              field="current_unit_stay/start_date"
              label="En réanimation depuis le"
              dataType={{ valueType: "date" }}
              value={unitStay.start_date}
              // value={hospitalisationDate}
              infoToAdd={`(${dateToDayStep(unitStay.start_date)})`}
            // infoToAdd={`(${dateToDayStep(hospitalisationDate)})`}
            />
          </Grid>
          <Typography variant="h6">Informations démographiques</Typography>
          <Grid item xs={12} container space={2}>
            <Grid item xs={6} sm={6} container direction="column">
              <Grid item>
                <MyDataCell
                  field="NIP_id"
                  label="NIP"
                  dataType={{ valueType: "string" }}
                  value={nipId}
                />
              </Grid>
              <Grid item>
                <MyDataCell
                  field="family_name"
                  label="Nom"
                  dataType={{ valueType: "string" }}
                  value={familyName}
                />
              </Grid>
              <Grid item>
                <MyDataCell
                  field="first_name"
                  label="Prénom"
                  dataType={{ valueType: "string" }}
                  value={firstName}
                />
              </Grid>
              <Grid item>
                <MyDataCell
                  field="sex"
                  label="Sexe"
                  dataType={{
                    valueType: "string",
                    enum: Object.keys(sexInterface),
                    enumNames: Object.values(sexInterface),
                  }}
                  value={sex}
                />
              </Grid>
            </Grid>

            <Grid item xs={6} sm={6} container direction="column">
              <Grid item>
                <MyDataCell
                  field="birth_date"
                  label="Naissance"
                  dataType={{ valueType: "date" }}
                  value={birthDate}
                  infoToAdd={toAddBirthDate}
                />
              </Grid>
              <Grid item>
                <MyDataCell
                  field="weight_kg"
                  label="Poids (kg)"
                  dataType={{ valueType: "number" }}
                  value={weight}
                />
              </Grid>
              <Grid item>
                <MyDataCell
                  field="size_cm"
                  label="Taille (cm)"
                  dataType={{ valueType: "number" }}
                  infoToAdd={toAddSize}
                  value={size}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {isEditable ? (
          <Actions
            onCancel={onCancel}
            onSubmit={onSubmit}
            loading={loading}
            classes={classes}
          />
        ) : (
            readOnly && (
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
            )
          )}
      </Box>
    </React.Fragment>
  );
};

DemographicDisplay.propTypes = {
  unitStay: PropTypes.object,
  hospitalisationDate: PropTypes.instanceOf(Date),
  isEditable: PropTypes.bool,
  nipId: PropTypes.string,
  familyName: PropTypes.string,
  firstName: PropTypes.string,
  sex: PropTypes.oneOf(["M", "F", ""]),
  sexInterface: PropTypes.object,
  birthDate: PropTypes.instanceOf(Date),
  toAddBirthDate: PropTypes.string,
  weight: PropTypes.number,
  size: PropTypes.number,
  toAddSize: PropTypes.string,
  hospitalisationCause: PropTypes.string,
  cellFocus: PropTypes.string,
  readOnly: PropTypes.bool,
  typoVariant: PropTypes.string,
  onFieldChange: PropTypes.func,
  handleKeyPress: PropTypes.func,
  makeEditable: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

DemographicDisplay.defaultProps = {
  bedInfo: "",
  isEditable: false,
  sexInterface: {},
  readOnly: false,
  typoVariant: "body2",
  loading: false,
};

export default DemographicDisplay;
