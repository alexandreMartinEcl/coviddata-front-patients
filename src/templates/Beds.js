import React from "react";
import { Grid } from "@material-ui/core";

export default function PatientTemplate({ components }) {
  const { ReanimationServices, Snackbar } = components;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} container justify="space-around">
        <ReanimationServices />
      </Grid>
      <Snackbar />
    </Grid>
  );
}
