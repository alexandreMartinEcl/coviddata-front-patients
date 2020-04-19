import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(2),
      padding: theme.spacing(4),
    },
  },
}));

function PatientEdit({ components }) {
  const { Form } = components;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Link to="/">
          <Button variant="contained">Retour</Button>
        </Link>
        <Form />
      </Paper>
    </div>
  );
}

export default PatientEdit;
