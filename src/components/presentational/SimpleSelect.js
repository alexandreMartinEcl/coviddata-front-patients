import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MenuItem, Box, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  rootBox: {
    margin: "2px",
    padding: "2px",
    backgroundColor: "white",
    borderWidth: "1px",
    borderColor: "#CAF1EC",
    borderRadius: "10px",
  },
}));

const SelectWithValues = ({
  title,
  value,
  onChange,
  values,
  color,
  ...props
}) => (
  <Select
    margin="dense"
    label={title}
    value={value}
    onChange={onChange}
    style={{ margin: "4px", color: color }}
    variant="outlined"
    {...props}
  >
    {Object.entries(values).map(([value, displayed]) => (
      <MenuItem key={value} value={value}>
        {displayed}
      </MenuItem>
    ))}
  </Select>
);

const SimpleSelect = ({
  title,
  value,
  values,
  icon,
  color,
  onChange,
  readOnly,
  loading,
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Box border={1} className={classes.rootBox}>
        <Grid container alignItems="center" justify="center">
          {icon}
          <SelectWithValues
            title={title}
            value={value}
            onChange={onChange}
            values={values}
            color={color}
            disabled={readOnly}
          />
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Grid>
      </Box>
    </React.Fragment>
  );
};

SimpleSelect.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  values: PropTypes.object,
  icon: PropTypes.element,
  color: PropTypes.string,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  readOnly: PropTypes.bool,
};

SimpleSelect.defaultProps = {
  value: "",
  values: {},
  color: "#000000",
  loading: false,
  readOnly: false,
};

export default SimpleSelect;
