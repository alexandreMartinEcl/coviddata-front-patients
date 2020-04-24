import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";

export default function PatientTemplate({ changeMode, gardeMode, components }) {
  const {
    PatientInfos,
    SeverityField,
    Depistages,
    Antecedents,
    Allergies,
    RecentDiseaseHistory,
    Evolution,
    TodoList,
    LatText,
    DayPicture,
  } = components;

  let modeButtonText = gardeMode ? "Mode garde" : "Mode normal";
  let modeButtonColor = gardeMode ? "primary" : "secondary";
  let modeToSet = gardeMode ? "normal" : "garde";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} container justify="space-around">
        <Grid xs={3} sm={3} item>
          <Link to="/">
            <Button variant="contained">Retour</Button>
          </Link>
        </Grid>

        <Grid xs={3} sm={3} item>
          <Button
            variant="contained"
            color={modeButtonColor}
            onClick={() => changeMode(modeToSet)}
          >
            {modeButtonText}
          </Button>
        </Grid>

        <Grid xs={3} sm={3} item>
          <TodoList />
        </Grid>

        <Grid xs={3} sm={3} item>
          <LatText />
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        sm={12}
        spacing={1}
        alignItems="flex-start"
        justify="center"
      >
        <Grid
          item
          xs={12}
          sm={gardeMode ? 12 : 8}
          container
          justify="flex-start"
        >
          <Grid item xs={12} sm={12}>
            <PatientInfos />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={4} container justify="center">
          <Grid item xs={12} sm={12}>
            <Depistages />
          </Grid>
          <Grid item xs={8} sm={12}>
            <SeverityField />
          </Grid>
        </Grid>
      </Grid>

      <Grid container item xs={12} sm={12} spacing={2}>
        <Grid item container xs={12} sm={12} spacing={2}>
          <Grid xs={12} sm={12} item>
            <Antecedents />
          </Grid>
          <Grid xs={12} sm={12} item>
            <Allergies />
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12} sm={12} spacing={2} justify="space-around">
        <Grid xs={12} sm={12} item>
          <RecentDiseaseHistory />
        </Grid>
        <Grid xs={12} sm={12} item>
          <Evolution />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12}>
        <DayPicture />
      </Grid>
    </Grid>
  );
}
