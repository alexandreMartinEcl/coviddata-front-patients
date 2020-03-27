import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
    Card,
    CardContent
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },

    cardColumn: {
        root: { paddingTop: 1, paddingBottom: 1 }
    }
}));

export default function PatientTemplate({ components }) {
    const { PatientContent, VentilationTable, Ventilation, Plot } = components;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Link to="/">
                    <Button variant="contained">Retour</Button>
                </Link>
            </Grid>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <PatientContent />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item container xs={12} md={8} spacing={1}>
                    <Grid xs={12} item pb={1}>
                        <VentilationTable />
                    </Grid>
                    <Grid xs={12} item pt={1}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography
                                    className={classes.secondaryHeading}
                                >
                                    Ajouter une nouvelle donnée de ventilation
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Ventilation />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                    <Grid xs={12} item>
                        <Card>
                            <CardContent>
                                <Plot />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
