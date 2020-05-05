import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { FormDialog } from "../Form";
import {
  IconButton,
  CircularProgress,
  DialogContent,
  DialogActions,
  Dialog,
  Grid,
} from "@material-ui/core";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.default,
  },
  button: {
    fontSize: "0.8rem",
    whiteSpace: "normal",
  },
}));

const RemoveDial = ({
  reaName,
  onCancel,
  removeReanimationService,
  loading,
  classes,
  ...props
}) => (
  <Dialog {...props}>
    <DialogContent>
      Êtes-vous sûr de vouloir vous retirer l'accès à : {reaName} ?
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary" variant="outlined">
        Annuler
      </Button>
      <Button
        onClick={removeReanimationService}
        color="primary"
        variant="contained"
      >
        Retirer
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </DialogActions>
  </Dialog>
);

const CustomAppBar = ({
  tabValue,
  onTabChange,
  removeTab,
  labels,
  openDial,
  openRemoveDial,
  cancelRemoveDial,
  removeDialOpen,
  reaToRemove,
  loading,
  classes,
}) => (
  <AppBar position="static" color="default">
    <Tabs
      value={tabValue}
      // onChange={onTabChange}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
    >
      {labels.map((label) => {
        return (
          <React.Fragment key={label.title}>
            <Tab
              label={
                <Grid container>
                  <Grid item xs={10}>
                    {label.title}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{ position: "relative", top: "-10px" }}
                  >
                    <IconButton>
                      <CancelIcon onClick={openRemoveDial(label.serviceId)} />
                    </IconButton>
                  </Grid>
                </Grid>
              }
              //TODO should be onChange in Tabs, but doesnt work..
              onClick={() => onTabChange(label.tabId)}
              {...a11yProps(label.tabId)}
            />
          </React.Fragment>
        );
      })}
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={openDial}
      >
        Nouveau
      </Button>
      <RemoveDial
        open={removeDialOpen}
        reaName={reaToRemove.title}
        onCancel={cancelRemoveDial}
        onClose={cancelRemoveDial}
        removeReanimationService={removeTab(reaToRemove.serviceId)}
        loading={loading}
        classes={classes}
      />
    </Tabs>
  </AppBar>
);

const ReanimationTabs = ({
  labels,
  contents,
  onTabChange,
  removeTab,
  tabValue,
  formProps,
  dialOpen,
  cancelDial,
  closeDial,
  openDial,
  loading,
  openRemoveDial,
  cancelRemoveDial,
  removeDialOpen,
  reaToRemove,
  addRea,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CustomAppBar
        tabValue={tabValue}
        onTabChange={onTabChange}
        removeTab={removeTab}
        labels={labels}
        openDial={openDial}
        openRemoveDial={openRemoveDial}
        cancelRemoveDial={cancelRemoveDial}
        removeDialOpen={removeDialOpen}
        reaToRemove={reaToRemove}
        loading={loading}
        classes={classes}
      />
      {contents.map((content) => {
        return (
          <TabPanel key={content.id} value={tabValue} index={content.id}>
            {content.toRender}
          </TabPanel>
        );
      })}
      <FormDialog
        formProps={formProps}
        open={dialOpen}
        onCancel={cancelDial}
        onClose={closeDial}
        onSubmit={addRea}
        cancelText={"Annuler"}
        submitText={"Ajouter"}
        loading={loading}
      />
    </div>
  );
};

ReanimationTabs.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      tabId: PropTypes.number,
      serviceId: PropTypes.string,
    })
  ),
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.element,
    })
  ),
  onTabChange: PropTypes.func,
  removeTab: PropTypes.func,
  tabValue: PropTypes.number,
  formProps: PropTypes.object,
  dialOpen: PropTypes.bool,
  cancelDial: PropTypes.func,
  closeDial: PropTypes.func,
  openDial: PropTypes.func,
  loading: PropTypes.bool,
  addRea: PropTypes.func,
};

ReanimationTabs.defaultProps = {
  loading: false,
};

export default ReanimationTabs;
