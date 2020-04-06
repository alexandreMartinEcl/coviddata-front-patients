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

const dataMoc = {
  id: 5,
  bed: null,
  current_unit_stay: {
    id: 11,
    is_finished: false,
    start_date: "2020-04-01",
    end_date: null,
    created_by: "user1",
    bed: 1,
  },
  status_measures: [
    {
      id: 2,
      state_type: 2,
      value: "truc",
      created_date: "2020-04-06T00:00:00Z",
      created_by: "user1",
      patient: 5,
      reanimation_service: 1,
    },
    {
      id: 3,
      state_type: 2,
      value: "truc",
      created_date: "2020-04-06T00:00:00Z",
      created_by: "user2",
      patient: 5,
      reanimation_service: 1,
    },
  ],
  unit_stays: [
    {
      id: 3,
      is_finished: true,
      start_date: "2020-04-04",
      end_date: "2020-04-07",
      created_by: "user1",
      bed: 4,
    },
    {
      id: 11,
      is_finished: false,
      start_date: "2020-04-01",
      end_date: null,
      created_by: "user1",
      bed: 1,
    },
  ],
  current_reanimation_service: {
    id: 1,
    name: "Rea1",
    hospital: 1,
  },
  size_cm: null,
  weight_kg: null,
  NIP_id: "12345",
  first_name: null,
  family_name: null,
  birth_date: null,
  sex: null,
  detection_covid: false,
  detection_orlEntree: false,
  detection_ERentree: false,
  detection_ERpremierMardi: false,
  detection_ERsecondMardi: false,
  antecedents: null,
  allergies: null,
  severity: 2,
  recent_disease_history: "",
  evolution: "",
  todo_list: "",
  last_edited_todo_list: null,
  assigned_caregivers: [],
};

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
