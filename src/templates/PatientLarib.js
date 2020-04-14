import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  cardColumn: {
    root: { paddingTop: 1, paddingBottom: 1 },
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

      <Grid item xs={12}>
        <Link to="/">
          <Button variant="contained">Retour</Button>
        </Link>
      </Grid>

      <Grid item xs={12} md={12}>
        <PatientInfos />
      </Grid>

      <Grid container item xs={12} spacing={2}>
        <Grid item container xs={8} md={8} spacing={1}>
          <Grid xs={12} item>
              <Antecedents />
          </Grid>
          <Grid xs={12} item>
              <Allergies />
          </Grid>
        </Grid>

        <Grid item xs={4} md={4}>
          <Grid xs={12} item pb={1}>
            <Depistages />
          </Grid>
        </Grid>
      </Grid>

      <Grid item container xs={12} md={12} spacing={3}>
        <Grid xs={9} container item>
          <Grid xs={12} item>
            <Paper>
              <RecentDiseaseHistory />
            </Paper>
          </Grid>
          <Grid xs={12} item>
            <Paper>
              <Evolution />
            </Paper>
          </Grid>
        </Grid>
        <Grid xs={3} item>
          <TodoList />
        </Grid>
      </Grid>

      <Grid item xs={12} md={12}>
        <MeasuresTable />
      </Grid>
    </Grid>
  );
}
