import React from "react";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//   },
// }));

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
    DayPicture,
  } = components;
  // const classes = useStyles();

  let modeButtonText = gardeMode ? "Mode normal" : "Mode garde";
  let modeButtonColor = gardeMode ? "primary" : "secondary";
  let modeToSet = gardeMode ? "normal" : "garde";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} container justify="space-between">
        <Grid xs={2} sm={2} item>
          <Link to="/">
            <Button variant="contained">Retour</Button>
          </Link>
        </Grid>

        <Grid xs={2} sm={2} item>
          <Button
            variant="contained"
            color={modeButtonColor}
            onClick={() => changeMode(modeToSet)}
          >
            {modeButtonText}
          </Button>
        </Grid>

        <Grid xs={2} sm={2} item>
          <TodoList />
        </Grid>
      </Grid>

      <Grid container item xs={12} sm={12} spacing={3} alignItems="center">
        <Grid
          item
          xs={12}
          sm={gardeMode ? 12 : 9}
          container
          justify="flew-start"
        >
          <Grid item xs={9} sm={12}>
            <PatientInfos />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Paper>
              <SeverityField />
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Depistages />
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
        <Grid xs={12} sm={9} container item>
          <Grid xs={12} sm={12} item>
            <Paper>
              <RecentDiseaseHistory />
            </Paper>
          </Grid>
          <Grid xs={12} sm={12} item>
            <Paper>
              <Evolution />
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12}>
        <Paper>
          <DayPicture />
          {/* <Typography variant="h3">Photo du jour</Typography>
          <Grid container spacing={2} justify="space-around">
            <Grid xs={12} sm={8} item>
              <DayNotice />
            </Grid>

            <Grid xs={12} sm={4} item>
              <Failures />
            </Grid>

            <Grid xs={12} sm={12} item>
              <MeasuresTable />
            </Grid>
          </Grid> */}
        </Paper>
      </Grid>
    </Grid>
  );
}
