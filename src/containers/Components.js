import React from "react";
import { useParams } from "react-router-dom";
import BedsA from "../containers/Beds";
import PatientA from "../containers/Patient";
import PatientsTableA from "../containers/PatientsTable";
import PatientContentA from "../containers/PatientContent";
import PatientEditA from "../containers/PatientEdit";
import VentilationsTableA from "../containers/VentilationsTable";
import VentilationEditA from "../containers/VentilationEdit";
import withDataFromFetch from "../shared/HOCs/withDataFromFetch";
import Container from "@material-ui/core/Container";
import config from "../config";

function withData(Component, props, url, extraConfig = {}) {
    const ComponentWithData = withDataFromFetch(Component, {
        url,
        config: {
            ...config.axios,
            ...extraConfig
        }
    });
    return <ComponentWithData {...props} />;
}

export const PatientB = PatientA;
export const PatientsTableB = props =>
    withData(PatientsTableA, props, config.path.patient);
export const PatientContent = props =>
    withData(PatientContentA, props, `${config.path.patient}${props.id}/`);
export const PatientEditB = props => {
    const { id } = useParams();
    return id ? (
        withData(PatientEditA, props, `${config.path.patient}${id}/`)
    ) : (
        <PatientEditA id={id} {...props} />
    );
};
export const VentilationsTable = props =>
    withData(VentilationsTableA, props, config.path.ventilation_patient, {
        params: {
            patients: props.id
        }
    });
export const VentilationEdit = props => {
    const id = props.id;
    return id ? (
        withData(VentilationEditA, props, `${config.path.ventilation}${id}/`)
    ) : (
        <VentilationEditA id={id} {...props} />
    );
};
export const BedsB = props =>
    withData(BedsA, props, config.path.bed);

export default {
    PatientsTable: props => (
        <Container>
            <PatientsTableB {...props} />
        </Container>
    ),
    Patient: props => (
        <Container>
            <PatientB {...props} />
        </Container>
    ),
    PatientEdit: props => (
        <Container>
            <PatientEditB {...props} />
        </Container>
    ),
    Beds: props => (
        <Container>
            <BedsA {...props} />
        </Container>
    ),
};
