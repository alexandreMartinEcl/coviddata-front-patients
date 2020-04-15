import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function PatientTemplate({ components }) {
  const {
    PatientInfos,
    Depistages,
    Antecedents,
    Allergies,
    RecentDiseaseHistory,
    Evolution,
    TodoList,
    MeasuresTable,
  } = components;
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <Link to="/">
          <Button variant="contained">Retour</Button>
        </Link>
      </Grid>

      <Grid item xs={12} sm={12}>
        <PatientInfos />
      </Grid>

      <Grid container item xs={12} sm={12} spacing={10}>
        <Grid item container xs={12} sm={8} spacing={2}>
          <Grid xs={12} sm={12} item>
            <Antecedents />
          </Grid>
          <Grid xs={12} sm={12} item>
            <Allergies />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Grid xs={12} sm={12} item>
            <Depistages />
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
        <Grid xs={12} sm={3} item>
          <TodoList />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12}>
        <MeasuresTable />
      </Grid>
    </Grid>
  );
}
