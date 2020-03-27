import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import components from "../containers/Components";

function Routes(props) {
    const { PatientsTable, Patient, PatientEdit } = components;
    return (
        <Router>
            <Switch>
                <Route path="/patient/add">
                    <PatientEdit />
                </Route>
                <Route path="/patient/edit/:id">
                    <PatientEdit />
                </Route>
                <Route path="/patient/:id">
                    <Patient />
                </Route>
                <Route path="/">
                    <PatientsTable />
                </Route>
            </Switch>
        </Router>
    );
}

export default Routes;
