import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BuiForm from "@rjsf/core";
import Button from "@material-ui/core/Button";
import { translate } from "../config";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as _ from "lodash";
import { Dialog, DialogContent, DialogActions } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: "#60E73C",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export const SimpleForm = function SimpleForm(props) {
  const classes = useStyles();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);

  const newProps = _.cloneDeep(props);
  const { onSubmit } = newProps;
  delete newProps.onSubmit;

  return (
    <BuiForm onSubmit={(form) => onSubmit(form, setLoading)} {...newProps}>
      <div className={classes.wrapper}>
        <Button type="submit" variant="contained" color="primary">
          {id ? translate.button.change : translate.button.add}
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </BuiForm>
  );
};

export const FormDialog = ({ formProps, actions, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <BuiForm {...formProps}>
          {/* this is to prevent Submit button */}
          <div />
        </BuiForm>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

FormDialog.propTypes = {
  formProps: PropTypes.object,
  actions: PropTypes.element,
};
