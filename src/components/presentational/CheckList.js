import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import HistoryIcon from "@material-ui/icons/History";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Tooltip, Grid, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  customCheckbox: {
    width: "50px",
    height: "50px",
  },
  rootBox: {
    padding: "2px",
    paddingLeft: "20px",
    margin: "15px",
    backgroundColor: "white",
    borderRadius: "15px",
  },
  formLabel: {
    paddingTop: "5px",
    paddingLeft: "5px",
  },
}));

const ChecklistActions = ({ onCancel, onSubmit, loading, classes }) => (
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

ChecklistActions.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  classes: PropTypes.object,
};

ChecklistActions.defaultProps = {
  onCancel: () => {},
  onSubmit: () => {},
  loading: false,
  classes: {},
};

const IconFormControl = (props) => (
  <Grid item xs={3} key={props.label}>
    <FormControlLabel
      control={
        <React.Fragment>
          <Tooltip
            title={
              <div>
                {props.label.split("\n").map((rw) => (
                  <React.Fragment>
                    {rw}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            }
            arrow
          >
            <Checkbox
              checkedIcon={props.customIcon}
              icon={props.customIcon}
              className={props.classes.customCheckbox}
              name={props.key}
              checked={props.value}
              onChange={(event) =>
                props.onChange(event.target.checked, props.field)
              }
              color="primary"
            />
          </Tooltip>
        </React.Fragment>
      }
    />
  </Grid>
);

const CheckBoxFormControl = (props) => (
  <FormControlLabel
    key={props.label}
    control={
      <Checkbox
        name={props.label}
        checked={props.value}
        style={{ padding: "1px", paddingLeft: "9px" }}
        onChange={(event) => props.onChange(event.target.checked, props.field)}
      />
    }
    label={props.label}
  />
);

const CustomFormControlLabel = (props) => {
  return props.customIcon ? (
    <IconFormControl {...props} />
  ) : (
    <CheckBoxFormControl {...props} />
  );
};

CustomFormControlLabel.propTypes = {
  field: PropTypes.string,
  label: PropTypes.string,
  customIcon: PropTypes.element,
  classes: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

CustomFormControlLabel.defaultProps = {
  field: "",
  label: "None",
  customIcon: null,
  classes: {},
  onChange: () => {},
  value: false,
};

const CheckList = ({
  title,
  customIcons,
  labels,
  data,
  changeCheck,
  readOnly,
  onChange,
  onSubmit,
  onCancel,
  loadingUpdate,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box className={classes.rootBox}>
        <FormControl component="fieldset" error={changeCheck}>
          <FormLabel className={classes.formLabel} component="legend">
            {title}
          </FormLabel>
          <FormGroup>
            <Grid container justify="flex-start">
              {Object.entries(data).map(([k, v]) => (
                <CustomFormControlLabel
                  field={k}
                  label={labels[k]}
                  customIcon={customIcons && customIcons[k]}
                  classes={classes}
                  onChange={onChange}
                  value={v}
                />
              ))}
            </Grid>
          </FormGroup>
        </FormControl>
        {readOnly || !changeCheck ? (
          <></>
        ) : (
          <ChecklistActions
            onCancel={onCancel}
            onSubmit={onSubmit}
            loading={loadingUpdate}
            classes={classes}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

CheckList.propTypes = {
  title: PropTypes.string,
  customIcons: PropTypes.objectOf(PropTypes.element),
  labels: PropTypes.objectOf(PropTypes.string),
  data: PropTypes.objectOf(PropTypes.bool),
  changeCheck: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  loadingUpdate: PropTypes.bool,
};

CheckList.defaultProps = {
  title: "",
  customIcons: {},
  labels: {},
  data: {},
  changeCheck: false,
  readOnly: false,
  onChange: () => {},
  onSubmit: () => {},
  onCancel: () => {},
  loadingUpdate: false,
};

export default CheckList;
