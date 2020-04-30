import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";

import Paper from "@material-ui/core/Paper";
import { ListSubheader, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  unitTitle: {
    marginRight: "100px",
  },
  subHeaderContent: {
    width: "100%",
    maxWidth: "500px",
  },
}));

const ReanimationUnit = ({
  name,
  nbSevere,
  nbAvailable,
  iconSevere,
  iconBed,
  bedElements,
}) => {
  const classes = useStyles();

  return (
    <Paper key={name}>
      <List
        subheader={
          <React.Fragment>
            <ListSubheader component="div" className={classes.unitTitle}>
              <Grid
                container
                justify="flex-start"
                spacing={2}
                className={classes.subHeaderContent}
              >
                <Grid item xs>
                  {name}
                </Grid>
                <Grid item container xs>
                  <Grid item xs={6}>
                    {iconSevere}
                  </Grid>
                  <Grid item xs={6}>
                    {nbSevere}
                  </Grid>
                </Grid>
                <Grid item container xs>
                  <Grid item xs={6}>
                    {iconBed}
                  </Grid>
                  <Grid item xs={6}>
                    {nbAvailable}
                  </Grid>
                </Grid>
              </Grid>
            </ListSubheader>
          </React.Fragment>
        }
      >
        {bedElements}
      </List>
    </Paper>
  );
};

ReanimationUnit.propTypes = {
  name: PropTypes.string,
  nbSevere: PropTypes.number,
  nbAvailable: PropTypes.number,
  iconSevere: PropTypes.element,
  iconBed: PropTypes.element,
  bedElements: PropTypes.arrayOf(PropTypes.element),
};

export default ReanimationUnit;
