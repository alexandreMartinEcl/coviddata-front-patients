import React from "react";
import { useParams } from "react-router-dom";
import * as _ from "lodash";
import { connect } from "react-redux";

import { uiInform } from "../store/actions";

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
  getDemographicData,
  getSeverity,
  getDetectionData,
  getAntecedentsData,
  getFailuresData,
  getTextData,
  getStatusMeasuresData,
  getAllergiesData,
} from "../repository/patient.repository";

function PatientLarib({ data = {}, reFetch, uiInform }) {
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
    reFetch();
  };

  // DEMOGRAPHIC
  let demographicData = getDemographicData(data);

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

  // DETECTIONS
  let { dataCheckList, depistageInterface } = getDetectionData(data);
  const getDetectionCheckList = (data) => getDetectionData(data).dataCheckList;

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
  };

  return (
    <PatientTemplate
      changeMode={updateMode}
      gardeMode={gardeMode}
      components={components}
    />
  );
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch => ({
  uiInform: (message, severity) => dispatch(uiInform(message, severity))
})

export default connect(mapStateToProps, mapDispatchToProps)(PatientLarib);
