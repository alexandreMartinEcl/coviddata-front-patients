import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PatientTemplate from "../templates/PatientLarib";
import {
  PatientHeader,
  ListLabels,
  EditableText,
  MeasuresTable,
  CheckList,
} from "./Components";
import { object } from "prop-types";

function PatientLarib({ data = {} }) {
  const { id } = useParams();

  const [measuresId, setMeasuresId] = useState();

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
  }
  let allergies;
  if (data.allergies) {
    try {
      allergies = JSON.parse(data.allergies);
    } catch (e) {
      allergies = [];
    }
  } else {
    allergies = [];
  }

  let antecedents;
  if (data.antecedents) {
    try {
      // data.antecedents is like ' {"type": string} '
      antecedents = JSON.parse(data.antecedents);
      antecedents = Object.entries(antecedents).map((entry) => ({
        title: entry[0],
        value: entry[1],
      }));
    } catch (e) {
      antecedents = [];
    }
  } else {
    antecedents = [];
  }

  const { recent_disease_history, last_edited_recent_disease_history } = data;
  const dataRecDisHist = {
    text: recent_disease_history,
    lastEdited: last_edited_recent_disease_history,
  };

  const { evolution, last_edited_evolution } = data;
  const dataEvo = { text: evolution, lastEdited: last_edited_evolution };

  const { todo_list, last_edited_todo_list } = data;
  const dataTodo = { text: todo_list, lastEdited: last_edited_todo_list };

  let dataMeasures;
  const { status_measures, unit_stays } = data;
  dataMeasures = { measures: status_measures };
  if (unit_stays && unit_stays.length) {
    dataMeasures.hospitalisationDate = new Date(
      Math.min(...unit_stays.map((s) => new Date(s.start_date)))
    );
    dataMeasures.hospitalisationEndDate = unit_stays.filter(
      (s) => !s.is_finished
    ).length
      ? null
      : new Date(Math.max(...unit_stays.map((s) => new Date(s.end_date))));
  }

  const components = {
    PatientInfos: (props) => (
      <PatientHeader patientId={id} data={dataPatientInfo} {...props} />
    ),
    Depistages: (props) => (
      <CheckList
        patientId={id}
        title="Dépistages"
        data={{ checks: dataCheckList }}
        dataInterface={depistageInterface}
        {...props}
      />
    ),
    Antecedents: (props) => (
      <ListLabels
        patientId={id}
        doubleInfoElseSingle={true}
        field="antecedents"
        title="Antécédents"
        data={{ listItems: antecedents }}
        {...props}
      />
    ),
    Allergies: (props) => (
      <ListLabels
        patientId={id}
        doubleInfoElseSingle={false}
        field="allergies"
        title="Allergies"
        data={{ listItems: allergies }}
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
        {...props}
      />
    ),
    MeasuresTable: (props) => (
      <MeasuresTable
        patientId={id}
        setMeasures={setMeasuresId}
        patient={id}
        data={dataMeasures}
        {...props}
      />
    ),
  };

  return <PatientTemplate components={components} />;
}

export default PatientLarib;
