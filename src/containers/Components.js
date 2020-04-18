import React from "react";
import { useParams } from "react-router-dom";
import BedsA from "../containers/Beds";
import PatientA from "../containers/Patient";
import PatientLaribA from "../containers/PatientLarib";
import PatientsTableA from "../containers/PatientsTable";
import PatientContentA from "../containers/PatientContent";
import PatientHeaderA from "../containers/PatientHeader";
import SimpleFieldA from "../components/patient/SimpleField";
import CheckListA from "../components/patient/CheckList";
import PatientEditA from "../containers/PatientEdit";
import VentilationsTableA from "../containers/VentilationsTable";
import VentilationEditA from "../containers/VentilationEdit";
import oldMeasuresTableA from "../containers/old_MeasuresTable";
import MeasuresTableA from "../containers/MeasuresTable";
import DayPictureA from "../containers/DayPicture";
import EditableTextA from "../components/patient/EditableText";
import ListLabelsA from "../components/patient/ListLabels";
import withDataFromFetch from "../shared/HOCs/withDataFromFetch";
import Container from "@material-ui/core/Container";
import config from "../config";

function withData(Component, props, url, extraConfig = {}) {
  const ComponentWithData = withDataFromFetch(Component, {
    url,
    config: {
      ...config.axios,
      ...extraConfig,
    },
  });
  return <ComponentWithData {...props} />;
}

export const PatientB = PatientA;

export const SimpleField = SimpleFieldA;

export const CheckList = CheckListA;

export const PatientHeader = PatientHeaderA;

export const EditableText = EditableTextA;

export const ListLabels = ListLabelsA;

export const DayPicture = DayPictureA;

export const oldMeasuresTable = oldMeasuresTableA;
export const MeasuresTable = MeasuresTableA;

export const BedsB = (props) => withData(BedsA, props, config.path.bed);

export const PatientsTableB = (props) =>
  withData(PatientsTableA, props, config.path.patient);

export const PatientContent = (props) =>
  withData(PatientContentA, props, `${config.path.patient}${props.id}/`);

export const PatientLaribB = (props) => {
  const { id } = useParams();
  return id ? (
    withData(PatientLaribA, props, `${config.path.patient}${id}`)
  ) : (
    // TODO:result is not prepared for this case
    <PatientLaribA id={id} {...props} />
  );
};

export const PatientEditB = (props) => {
  const { id } = useParams();
  return id ? (
    withData(PatientEditA, props, `${config.path.patient}${id}/`)
  ) : (
    <PatientEditA id={id} {...props} />
  );
};

export const VentilationsTable = (props) =>
  withData(VentilationsTableA, props, config.path.ventilation_patient, {
    params: {
      patients: props.id,
    },
  });

export const VentilationEdit = (props) => {
  const id = props.id;
  return id ? (
    withData(VentilationEditA, props, `${config.path.ventilation}${id}/`)
  ) : (
    <VentilationEditA id={id} {...props} />
  );
};

// export const MeasuresTable = props =>
//     withData(MeasuresTableA, props, config.path.measure_patient, {
//         params: {
//             patients: props.id
//         }
//     });

export default {
  PatientsTable: (props) => (
    <Container>
      <PatientsTableB {...props} />
    </Container>
  ),
  Patient: (props) => (
    <Container>
      <PatientB {...props} />
    </Container>
  ),
  PatientLarib: (props) => (
    <Container>
      <PatientLaribB {...props} />
    </Container>
  ),
  PatientEdit: (props) => (
    <Container>
      <PatientEditB {...props} />
    </Container>
  ),
  Beds: (props) => (
    <Container>
      <BedsB {...props} />
    </Container>
  ),
};
