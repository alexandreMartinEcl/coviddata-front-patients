import React from "react";
import { useParams } from "react-router-dom";
import * as _ from "lodash";

import defaultLAT from "../shared/files/defaultLAT";
import PatientTemplate from "../templates/PatientLarib";


import {
  DemographicDisplay,
  ListLabels,
  EditableText,
  CheckList,
  SimpleSelect,
  DayPicture,
} from "./Components";

import { ToWatchIcon, LatIcon, TodoListIcon } from "../shared/icons/index";
import theme from "../theme";
import {
  howManyUnfilledTasksInMarkdown,
  howManyFilledTasksInMarkdown,
} from "../shared/utils/tools";
import { nbWeeksBetween } from "../shared/utils/date";
import {
  submitDetectionChecklist,
  submitEditableText,
  submitLabelList,
  submitSimpleSelect,
  submitDemographicData,
} from "../repository/patient.repository";
import SnackBar from "../components/SnackBar";

function PatientLarib({ data = {}, reFetch }) {
  const { id } = useParams();

  const [gardeMode, setGardeMode] = React.useState(
    localStorage.getItem("gardeMode") === "true" || false
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [infoMsg, setInfoMsg] = React.useState("");

  /**
   * Display information snackbar
   * @param {string} msg
   * @param {string} infoType either 'success', 'error', 'info' or 'warning'
   */
  const uiInform = (msg, infoType) => {
    // setInfoMsg(msg);
    // setSnackbarSeverity(infoType);
    // setSnackbarOpen(true);
  };

  const closeSnackBar = () => {
    setSnackbarOpen(false);
    setInfoMsg("");
  };

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

  // DEMOGRAPHIC
  const getDemographicData = (fullData) => {
    const {
      first_name,
      family_name,
      birth_date,
      weight_kg,
      size_cm,
      NIP_id,
      sex,
      current_unit_stay,
      hospitalisation_cause,
    } = fullData;
    const temData = {
      first_name,
      family_name,
      birth_date,
      weight_kg,
      size_cm,
      NIP_id,
      sex,
      current_unit_stay,
      hospitalisation_cause,
    };

    const { unit_stays } = fullData;
    if (unit_stays && unit_stays.length) {
      temData.hospitalisationDate = new Date(
        Math.min(...unit_stays.map((s) => new Date(s.start_date)))
      );
    }
    return _.cloneDeep(temData);
  };

  let demographicData = getDemographicData(data);
  // const [demographicData, setDemographicData] = React.useState(
  //   getDemographicData(data)
  // );
  // const updateDemographicData = (newData) => {
  //   setDemographicData(getDemographicData(newData));
  // };

  // SEVERITY
  const severityValues = { 0: "Haute", 1: "Moyenne", 2: "Faible" };
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

  const getSeverity = (fullData) => ({ value: fullData.severity });
  // const [severity, setSeverity] = React.useState(getSeverity(data));
  // const updateSeverity = (newData) => {
  //   setSeverity(_.cloneDeep(getSeverity(newData)));
  // };

  // DETECTIONS
  const getDetectionData = (fullData) => {
    const {
      detection_covid,
      detection_orl_entree,
      detection_ER_entree,
      detections_orl_weekly,
      detections_ER_weekly,
    } = fullData;

    const temData = {
      detection_covid,
      detection_orl_entree,
      detection_ER_entree,
    };

    const temInterface = {
      detection_covid: "Détection Covid",
      detection_orl_entree: "Détection Orl d'entrée",
      detection_ER_entree: "Détection ER d'entrée",
    };

    if (demographicData.hospitalisationDate) {
      [
        ...Array(
          nbWeeksBetween(demographicData.hospitalisationDate, new Date())
        ).keys(),
      ].forEach((i) => {
        temData[`detections_ER_weekly_${i + 1}`] =
          detections_ER_weekly && detections_ER_weekly[i]
            ? detections_ER_weekly[i]
            : false;
        temData[`detections_orl_weekly_${i + 1}`] =
          detections_orl_weekly && detections_orl_weekly[i]
            ? detections_orl_weekly[i]
            : false;
        temInterface[`detections_ER_weekly_${i + 1}`] = `Détection ER semaine ${
          i + 1
          }`;
        temInterface[
          `detections_orl_weekly_${i + 1}`
        ] = `Détection Orl semaine ${i + 1}`;
      });
    }

    return { dataCheckList: temData, depistageInterface: temInterface };
  };

  let { dataCheckList, depistageInterface } = getDetectionData(data);
  const getDetectionCheckList = (data) => getDetectionData(data).dataCheckList;
  // const [detectionData, setDetectionData] = React.useState(dataCheckList);

  // const updateDetectionData = (newData) => {
  //   setDetectionData(_.cloneDeep(getDetectionData(newData).dataCheckList));
  // };

  // ANTECEDENTS
  const getAntecedentsData = (fullData) => {
    let temList;
    if (fullData.antecedents) {
      try {
        let temJson = JSON.parse(fullData.antecedents);
        temList = Object.entries(temJson).map(([k, v]) => ({
          title: k,
          value: v,
        }));
      } catch (e) {
        temList = [];
      }
    } else {
      temList = [];
    }

    let antecedentsIsEmpty =
      Object.keys(temList).length === 0 ||
      (Object.keys(temList).length === 1 &&
        Object.keys(temList)[0] === "Inconnus");
    return { listItems: temList, isEmpty: antecedentsIsEmpty };
  };

  // const [antecedentsData, setAntecedentsData] = React.useState(
  //   getAntecedentsData(data)
  // );
  // const updateAntecedentsData = (newData) => {
  //   setAntecedentsData(newData);
  // };

  // ALLERGIES
  const getAllergiesData = (fullData) => {
    let temList;
    if (fullData.allergies) {
      try {
        temList = JSON.parse(fullData.allergies);
      } catch (e) {
        temList = [];
      }
    } else {
      temList = [];
    }

    let allergiesIsEmpty =
      temList.length === 0 ||
      (temList.length === 1 && temList[0] === "Inconnues");
    return { listItems: temList, isEmpty: allergiesIsEmpty };
  };

  // const [allergiesData, setAllergiesData] = React.useState(
  //   getAllergiesData(data)
  // );

  // const updateAllergiesData = (newData) => {
  //   setAllergiesData(newData);
  // };

  const getTextData = (field) => (fullData) => {
    let temDate = fullData[`last_edited_${field}`];
    return {
      text: fullData[field],
      lastEdited: temDate ? new Date(temDate) : null,
    };
  };

  // RECENT DISEASE HISTORY
  // const [
  //   recentDiseaseHistoryData,
  //   setRecentDiseaseHistoryData,
  // ] = React.useState(getTextData("recent_disease_history")(data));
  // const updateRecentDiseaseHistoryData = (newData) => {
  //   setRecentDiseaseHistoryData(newData);
  // };

  // EVOLUTION
  // const [evolutionData, setEvolutionData] = React.useState(
  //   getTextData("evolution")(data)
  // );
  // const updateEvolutionData = (newData) => {
  //   setEvolutionData(newData);
  // };

  // TODO LIST
  // const [todoListData, setTodoListData] = React.useState(
  //   getTextData("todo_list")(data)
  // );
  // const updateTodoListData = (newData) => {
  //   setTodoListData(newData);
  // };

  // TREATMENT LIMITATIONS
  // const [
  //   treatmentLimitationsData,
  //   setTreatmentLimitationsData,
  // ] = React.useState(getTextData("treatment_limitations")(data));
  // const updateTreatmentLimitationsData = (newData) => {
  //   setTreatmentLimitationsData(newData);
  // };

  // DAY_PICTURE
  const getFailuresData = (fullData) => {
    const {
      heart_failure,
      bio_chemical_failure,
      brain_failure,
      lung_failure,
      kidney_failure,
      liver_failure,
      hematologic_failure,
    } = fullData;

    const temData = {
      heart_failure,
      bio_chemical_failure,
      brain_failure,
      lung_failure,
      kidney_failure,
      liver_failure,
      hematologic_failure,
    };

    return temData;
  };

  const [failuresData, setFailuresData] = React.useState(getFailuresData(data));

  const updateFailuresData = (newData) => {
    setFailuresData(_.cloneDeep(getFailuresData(newData)));
  };

  // const [dayNoticeData, setDayNoticeData] = React.useState(
  //   getTextData("day_notice")(data)
  // );
  // const updateDayNoticeData = (newData) => {
  //   setDayNoticeData(newData);
  // };

  const getStatusMeasuresData = (fullData) => {
    const { status_measures, unit_stays } = fullData;
    let temData = { measures: status_measures };
    if (unit_stays && unit_stays.length) {
      temData.hospitalisationDate = new Date(
        Math.min(...unit_stays.map((s) => new Date(s.start_date)))
      );
      temData.hospitalisationEndDate = unit_stays.filter(
        (s) => !s.is_finished
      ).length
        ? null
        : new Date(Math.max(...unit_stays.map((s) => new Date(s.end_date))));
    }
    if (fullData.weight_kg) {
      temData.weight_kg = fullData.weight_kg;
    }
    return temData;
  }

  const getDayPictureData = (fullData) => ({
    failuresData: getFailuresData(fullData),
    dayNoticeData: getTextData("day_notice")(fullData),
    statusMeasuresData: getStatusMeasuresData(fullData),
  })

  const components = {
    PatientInfos: (props) => (
      <DemographicDisplay
        data={demographicData}
        readOnly={gardeMode}
        mapResToData={getDemographicData}
        processSubmit={submitDemographicData(id)}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    SeverityField: (props) => (
      <SimpleSelect
        title="Gravité"
        data={getSeverity(data)}
        values={severityValues}
        icons={severityIcons}
        colors={severityColors}
        readOnly={gardeMode}
        mapResToData={getSeverity}
        processSubmit={submitSimpleSelect("severity", id)}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    Depistages: gardeMode
      ? (props) => <></>
      : (props) => (
        <CheckList
          labels={depistageInterface}
          mapResToData={getDetectionCheckList}
          processSubmit={submitDetectionChecklist(
            demographicData
              ? nbWeeksBetween(
                demographicData.hospitalisationDate,
                new Date()
              )
              : 1,
            id
          )}
          title="Dépistages"
          data={dataCheckList}
          parentUiInform={uiInform}
          {...props}
        />
      ),
    Antecedents:
      (props) => (
        <ListLabels
          title="Antécédents"
          labelVariant="double"
          data={getAntecedentsData(data)}
          mapResToData={getAntecedentsData}
          processSubmit={submitLabelList("antecedents", "double", id)}
          readOnly={gardeMode}
          parentUiInform={uiInform}
          {...props}
        />
      ),
    Allergies: (props) => (
      <ListLabels
        title="Allergies"
        labelVariant="single"
        data={getAllergiesData(data)}
        mapResToData={getAllergiesData}
        processSubmit={submitLabelList("allergies", "single", id)}
        readOnly={gardeMode}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    RecentDiseaseHistory: (props) => (
      <EditableText
        patientId={id}
        label="Evénements récents"
        title="Histoire de la maladie récente"
        variant="extensible"
        data={getTextData("recent_disease_history")(data)}
        readOnly={gardeMode}
        mapResToData={getTextData("recent_disease_history")}
        processSubmit={submitEditableText("recent_disease_history", id)}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    Evolution: (props) => (
      <EditableText
        patientId={id}
        label="Evolution du patient depuis le début de la réanimation"
        title="Evolution"
        variant="extensible"
        data={getTextData("evolution")(data)}
        readOnly={gardeMode}
        mapResToData={getTextData("evolution")}
        processSubmit={submitEditableText("evolution", id)}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    TodoList: (props) => (
      <EditableText
        patientId={id}
        label="Liste à penser pour le patient"
        title="Todo list"
        variant="dial"
        data={getTextData("todo_list")(data)}
        readOnly={gardeMode}
        interpretorVariant="checklist"
        buttonIcon={<TodoListIcon style={{ width: "20px", height: "20px" }} />}
        badgeCounter={howManyUnfilledTasksInMarkdown}
        defaultText={`- [ ] A faire\n- [x] Fait`}
        defaultNewLine={`\n- [ ] `}
        parentUiInform={uiInform}
        mapResToData={getTextData("todo_list")}
        processSubmit={submitEditableText("todo_list", id)}
        {...props}
      />
    ),
    LatText: (props) => (
      <EditableText
        patientId={id}
        label="Modalités d'application des LAT"
        title="LAT"
        variant="dial"
        data={getTextData("treatment_limitations")(data)}
        readOnly={gardeMode}
        interpretorVariant="markdown"
        badgeCounter={howManyFilledTasksInMarkdown}
        defaultText={defaultLAT}
        buttonIcon={<LatIcon style={{ width: "20px", height: "20px" }} />}
        mapResToData={getTextData("treatment_limitations")}
        processSubmit={submitEditableText("treatment_limitations", id)}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    DayPicture: (props) => (
      <DayPicture
        patientId={id}
        reFetch={reFetch}
        readOnly={gardeMode}
        {...props}
        parentUiInform={uiInform}
        data={getDayPictureData(data)}
        mapResToData={{
          failuresData: getFailuresData,
          dayNoticeData: getTextData("day_notice"),
          statusMeasuresData: getStatusMeasuresData,                
        }}
      />
    ),
    Snackbar: (props) => (
      <SnackBar
        open={snackbarOpen}
        onClose={closeSnackBar}
        severity={snackbarSeverity}
        infoMsg={infoMsg}
        {...props}
      />
    ),
  };

  return (
    <PatientTemplate
      changeMode={updateMode}
      gardeMode={gardeMode}
      components={components}
    />
  );
}

export default PatientLarib;
