import React from "react";
import { useParams } from "react-router-dom";
import defaultLAT from "../shared/files/defaultLAT";

import PatientTemplate from "../templates/PatientLarib";
import {
  PatientHeader,
  ListLabels,
  EditableText,
  CheckList,
  SimpleSelect,
  DayPicture,
} from "./Components";

import { ToWatchIcon } from "../shared/icons/index";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import theme from "../theme";
// import { useTheme } from "@material-ui/core";

function PatientLarib({ data = {}, reFetch }) {
  const { id } = useParams();

  const [gardeMode, setGardeMode] = React.useState(
    localStorage.getItem("gardeMode") === "true" || false
  );

  const updateMode = (mode) => {
    switch (mode) {
      case "garde":
        localStorage.setItem("gardeMode", true);
        setGardeMode(true);
        break;
      case "normal":
        localStorage.setItem("gardeMode", false);
        setGardeMode(false);
        break;
      default:
        setGardeMode(false);
    }
  };

  const {
    first_name,
    family_name,
    birth_date,
    weight_kg,
    size_cm,
    NIP_id,
    sex,
    severity,
    current_unit_stay,
    hospitalisation_cause,
  } = data;
  const dataPatientInfo = {
    first_name,
    family_name,
    birth_date,
    weight_kg,
    size_cm,
    NIP_id,
    sex,
    severity,
    current_unit_stay,
    hospitalisation_cause,
  };

  const severityValues = ["Haute", "Moyenne", "Faible"];
  const severityDataInterface = { Haute: 0, Moyenne: 1, Faible: 2 };

  const severityIcons = {
    0: (
      <ToWatchIcon
        style={{
          width: "40px",
          height: "80%",
          borderWidth: "5px",
          color: theme.palette.danger.main,
        }}
      />
    ),
    1: (
      <ToWatchIcon
        style={{
          width: "40px",
          height: "80%",
          borderWidth: "1px",
          color: theme.palette.danger.light,
        }}
      />
    ),
    2: (
      <ToWatchIcon
        style={{
          width: "40px",
          height: "80%",
          borderWidth: "1px",
          color: theme.palette.secondary.main,
        }}
      />
    ),
  };

  const severityColors = {
    0: theme.palette.danger.main,
    1: theme.palette.danger.light,
    2: theme.palette.secondary.main,
  };

  const {
    detection_covid,
    detection_orlEntree,
    detection_ERentree,
    detection_ERpremierMardi,
    detection_ERsecondMardi,
  } = data;
  const dataCheckList = {
    detection_covid,
    detection_orlEntree,
    detection_ERentree,
    detection_ERpremierMardi,
    detection_ERsecondMardi,
  };
  const depistageInterface = {
    detection_covid: "Détection Covid",
    detection_orlEntree: "Détection Orl d'entrée",
    detection_ERentree: "Détection ER d'entrée",
    detection_ERpremierMardi: "Détection ER premier mardi",
    detection_ERsecondMardi: "Détection ER second mardi",
  };
  let allergies;
  const formatAllergies = (rawData) => {
    if (rawData) {
      try {
        return JSON.parse(rawData);
      } catch (e) {
        return [];
      }
    } else {
      return [];
    }
  };
  allergies = formatAllergies(data.allergies);
  let allergiesIsEmpty =
    allergies.length === 0 ||
    (allergies.length === 1 && allergies[0] === "Inconnues");

  let antecedents;
  const formatAntecedents = (rawData) => {
    if (rawData) {
      try {
        // rawData is like ' {"type": string} '
        let temJson = JSON.parse(rawData);
        return Object.entries(temJson).map((entry) => ({
          title: entry[0],
          value: entry[1],
        }));
      } catch (e) {
        return [];
      }
    } else {
      return [];
    }
  };
  antecedents = formatAntecedents(data.antecedents);
  let antecedentsIsEmpty =
    Object.keys(antecedents).length === 0 ||
    (Object.keys(antecedents).length === 1 &&
      Object.keys(antecedents)[0] === "Inconnus");

  const { recent_disease_history, last_edited_recent_disease_history } = data;
  const dataRecDisHist = {
    text: recent_disease_history,
    lastEdited: last_edited_recent_disease_history,
  };

  const { evolution, last_edited_evolution } = data;
  const dataEvo = { text: evolution, lastEdited: last_edited_evolution };

  const { todo_list, last_edited_todo_list } = data;
  const dataTodo = { text: todo_list, lastEdited: last_edited_todo_list };

  const { treatment_limitations, last_edited_treatment_limitations } = data;
  const dataLAT = { text: todo_list, lastEdited: last_edited_todo_list };

  const { unit_stays } = data;
  if (unit_stays && unit_stays.length) {
    dataPatientInfo.hospitalisationDate = new Date(
      Math.min(...unit_stays.map((s) => new Date(s.start_date)))
    );
  }

  const components = {
    PatientInfos: (props) => (
      <PatientHeader
        patientId={id}
        data={dataPatientInfo}
        reFetch={reFetch}
        readOnly={gardeMode}
        {...props}
      />
    ),
    SeverityField: (props) => (
      <SimpleSelect
        patientId={id}
        data={data}
        field="severity"
        title="Gravité"
        values={severityValues}
        dataInterface={severityDataInterface}
        icons={severityIcons}
        colors={severityColors}
        readOnly={gardeMode}
        {...props}
      />
    ),
    Depistages: gardeMode
      ? (props) => <></>
      : (props) => (
          <CheckList
            patientId={id}
            title="Dépistages"
            data={{ checks: dataCheckList }}
            dataInterface={depistageInterface}
            readOnly={gardeMode}
            {...props}
          />
        ),
    Antecedents:
      gardeMode && antecedentsIsEmpty
        ? (props) => <></>
        : (props) => (
            <ListLabels
              patientId={id}
              doubleInfoElseSingle={true}
              field="antecedents"
              title="Antécédents"
              data={{ listItems: antecedents }}
              formatData={formatAntecedents}
              reFetch={reFetch}
              readOnly={gardeMode}
              {...props}
            />
          ),
    Allergies:
      gardeMode && allergiesIsEmpty
        ? (props) => <></>
        : (props) => (
            <ListLabels
              patientId={id}
              doubleInfoElseSingle={false}
              field="allergies"
              title="Allergies"
              data={{ listItems: allergies }}
              formatData={formatAllergies}
              reFetch={reFetch}
              readOnly={gardeMode}
              {...props}
            />
          ),
    RecentDiseaseHistory: (props) => (
      <EditableText
        patientId={id}
        label="Evénements récents"
        title="Histoire de la maladie récente"
        extensibleElseDial={true}
        data={dataRecDisHist}
        field="recent_disease_history"
        reFetch={reFetch}
        readOnly={gardeMode}
        {...props}
      />
    ),
    Evolution: (props) => (
      <EditableText
        patientId={id}
        label="Evolution du patient depuis le début de la réanimation"
        title="Evolution"
        extensibleElseDial={true}
        data={dataEvo}
        field="evolution"
        reFetch={reFetch}
        readOnly={gardeMode}
        {...props}
      />
    ),
    TodoList: (props) => (
      <EditableText
        patientId={id}
        label="Liste à penser pour le patient"
        title="Todo list"
        extensibleElseDial={false}
        data={dataTodo}
        field="todo_list"
        reFetch={reFetch}
        readOnly={gardeMode}
        withMarkdown
        buttonIcon={<FormatListNumberedIcon />}
        defaultText={`- [ ] A faire\n- [x] Fait`}
        defaultNewLine={`\n- [ ] `}
        {...props}
      />
    ),
    LatText: (props) => (
      <EditableText
        patientId={id}
        label="Modalités d'application des LAT"
        title="LAT"
        extensibleElseDial={false}
        data={dataLAT}
        field="treatment_limitations"
        reFetch={reFetch}
        readOnly={gardeMode}
        withMarkdown
        defaultText={defaultLAT}
        buttonIcon={<FormatListNumberedIcon />}
        {...props}
      />
    ),
    DayPicture: (props) => (
      <DayPicture
        patientId={id}
        data={data}
        reFetch={reFetch}
        readOnly={gardeMode}
        {...props}
      />
    ),
  };

  return (
    <React.Fragment>
      <PatientTemplate
        changeMode={updateMode}
        gardeMode={gardeMode}
        components={components}
      />
    </React.Fragment>
  );
}

export default PatientLarib;
