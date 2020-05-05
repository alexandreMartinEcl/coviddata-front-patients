import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { FormDialog } from "../Form";

const useStyles = makeStyles((theme) => ({
  infosBox: {
    padding: "1px",
    marginLeft: "10px",
    width: "80%",
    maxWidth: "500px",
    borderColor: theme.palette.primary.light,
    borderRadius: "5px",
    backgroundColor: "white",
  },
  buttonProgress: {
    color: "#60E73C",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  icon: {
    width: "30px",
    height: "100%",
  },
}));

const SwapAction = ({ swaping, loading, classes, onCancel, onSubmit }) => (
  <React.Fragment>
    <Button onClick={onCancel} variant="outlined" color="primary">
      Annuler
    </Button>
    <Button onClick={onSubmit} variant="contained" color="primary">
      {swaping ? "Echanger" : "Déplacer"}
    </Button>
    {loading && (
      <CircularProgress size={24} className={classes.buttonProgress} />
    )}
  </React.Fragment>
);

export const BedSwapDial = ({
  formProps,
  swaping,
  onCancel,
  onSubmit,
  loading,
  ...props
}) => {
  const classes = useStyles();

  return (
    <FormDialog
      formProps={{
        liveValidate: true,
        ...formProps,
      }}
      actions={
        <SwapAction
          swaping={swaping}
          loading={loading}
          classes={classes}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      }
      {...props}
    />
  );
};

BedSwapDial.propTypes = {
  formProps: PropTypes.object,
  swaping: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  open: PropTypes.bool,
};

BedSwapDial.defaultProps = {
  swaping: false,
  loading: false,
  swapDialOpen: false,
};

export const ReanimationServicePresentational = ({
  infos,
  TodoListIcon,
  units,
  switchDisplayMode,
  gardeMode,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box border={1} className={classes.infosBox}>
        <Grid container alignItems="center" justify="space-around">
          {infos.map((info) => (
            <Grid key={info.title} item xs>
              <Typography variant="body1">
                <Tooltip title={info.title} arrow>
                  <span>
                    <info.icon color="secondary" className={classes.icon} />
                    {info.value}
                  </span>
                </Tooltip>
              </Typography>
            </Grid>
          ))}
          <Grid item xs>
            <TodoListIcon color="secondary" className={classes.icon} />
          </Grid>
          <Grid item xs>
            <FormControlLabel
              control={
                <Switch
                  checked={gardeMode}
                  onChange={switchDisplayMode}
                  name="checkedA"
                />
              }
              label="Mode garde"
            />
          </Grid>
        </Grid>
      </Box>
      {units}
    </React.Fragment>
  );
};

ReanimationServicePresentational.propTypes = {
  infos: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element,
      title: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  units: PropTypes.arrayOf(PropTypes.element),
};

ReanimationServicePresentational.defaultProps = {};