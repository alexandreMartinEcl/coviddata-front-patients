import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PatientTemplate from "../templates/Patient";
import {
    PatientContent,
    VentilationsTable,
    VentilationEdit
} from "./Components";
import Plot from "./Plot";

function Patient() {
    const { id } = useParams();

    const [ventilationId, setVentilationId] = useState();

    const components = {
        PatientContent: props => <PatientContent id={id} {...props} />,
        VentilationTable: props => (
            <VentilationsTable
                id={id}
                setVentilation={setVentilationId}
                {...props}
            />
        ),
        Ventilation: props => (
            <VentilationEdit id={ventilationId} patient={id} {...props} />
        ),
        Plot: props => <Plot {...props} />
    };

    return <PatientTemplate components={components} />;
}

export default Patient;
