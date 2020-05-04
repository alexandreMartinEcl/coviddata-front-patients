import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import IconButton from "@material-ui/core/IconButton";

import {
  UnitBedPresentational,
  UnitBedDialog,
} from "../presentational/UnitBed";

import { cloneSchema } from "../../shared/utils/schema";
import {
  manageError,
  howManyUnfilledTasksInMarkdown,
} from "../../shared/utils/tools";

import addPatientBasicFormSchema from "../../json/schemaPatientBasic.json";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import {
  HeartFailureIcon,
  BioChemicalFailureIcon,
  BrainFailureIcon,
  LungFailureIcon,
  KidneyFailureIcon,
  LiverFailureIcon,
  HematologicFailureIcon,
  TodoListIcon,
} from "../../shared/icons/index";
import { EditableText } from "../../containers/Components";
import {
  submitEditableText,
  getTextData,
} from "../../repository/patient.repository";

const icons = {
  heart_failure: (props) => <HeartFailureIcon {...props} />,
  bio_chemical_failure: (props) => <BioChemicalFailureIcon {...props} />,
  brain_failure: (props) => <BrainFailureIcon {...props} />,
  lung_failure: (props) => <LungFailureIcon {...props} />,
  kidney_failure: (props) => <KidneyFailureIcon {...props} />,
  liver_failure: (props) => <LiverFailureIcon {...props} />,
  hematologic_failure: (props) => <HematologicFailureIcon {...props} />,
  todoList: (props) => <TodoListIcon {...props} />,
};

//TOOD should be automated using jsonSchema but not that simple
const checkAddPatientForm = (form) => {
  return (
    (!form.NIP_id || form.NIP_id.match(/^[0-9]*$/g)) &&
    (!form.stay_start_date || new Date(form.stay_start_date) <= new Date()) &&
    (!form.family_name || form.family_name.match(/^[a-zA-Z\-\']*$/g)) &&
    (!form.first_name || form.first_name.match(/^[a-zA-Z\-\']*$/g)) &&
    (!form.birthDate || new Date(form.birthDate) <= new Date()) &&
    (!form.weight_kg || form.weight_kg.match(/^[0-9]{0,3}(\.[0-9]{0,3})?$/g)) &&
    (!form.size_cm || form.size_cm.match(/^[0-9]{0,3}(\.[0-9]{0,2})?$/g))
  );
};

const defaultFormData = {
  NIP_id: "",
  stay_start_date: new Date().toISOString().split("T")[0],
  family_name: "",
  first_name: "",
  birth_date: "",
  sex: "",
  severity: "",
  weight_kg: "",
  size_cm: "",
};

function UnitBed({
  bedData,
  setPage,
  processSubmitAddPatient,
  processSubmitRemovePatient,
  onSwapPatient,
  setParentData,
  parentUiInform,
  gardeMode,
}) {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(bedData));
  const [formData, setFormData] = React.useState(defaultFormData);

  const [loading, setLoading] = React.useState(false);
  const [dialOpen, setDialOpen] = React.useState(false);
  const [fullForm, setFullForm] = React.useState(
    localStorage.getItem("fullForm") === "true"
  );

  const handleKeyPress = (event) => {
    if (!dialOpen) return;
    switch (event.key) {
      case "Enter":
        current_stay ? submitRemovePatientFromBed() : submitAddPatient();
        break;
      case "Escape":
        closeDial();
        break;
      default:
        return;
    }
  };

  const schemaAddPatient = cloneSchema(addPatientBasicFormSchema).schema;
  const schemaAddPatientSmall = _.cloneDeep(schemaAddPatient);
  Object.keys(schemaAddPatientSmall.properties).forEach((k) => {
    if (["NIP_id", "stay_start_date"].find((e) => e === k)) return;
    delete schemaAddPatientSmall.properties[k];
  });
  const uiSchemaAddPatient = { NIP_id: { "ui:autofocus": true } };

  const bedStatusInterface = ["Libre", "Indisponible"];
  const severityInterface = ["A risque", "Instable", "Stable"];

  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantForBedItem = isUpSm ? "body1" : "body2";

  const handlePatientClick = (idPatient) => {
    if (idPatient) {
      setPage(`/patient/${idPatient}`);
    } else {
      return;
    }
  };

  const closeDial = () => {
    setDialOpen(false);
  };

  const cancelDial = () => {
    setFormData(defaultFormData);
    closeDial();
  };

  const openDial = () => setDialOpen(true);

  const updateFormData = ({ ...fData }) => {
    if (!checkAddPatientForm(fData.formData)) {
      setFormData(_.cloneDeep(formData));
    } else {
      setFormData(Object.assign(_.cloneDeep(formData), fData.formData));
    }
  };

  const changeFullForm = () => {
    localStorage.setItem("fullForm", !fullForm);
    setFullForm(!fullForm);
  };

  const onSubmitAddSuccess = (res) => {
    console.log("Data returned", res);

    parentUiInform && parentUiInform(`Patient ajouté`, "success");
    setLoading(false);
    closeDial();

    let temData = _.cloneDeep(dataCopy);
    let newPatientData = _.cloneDeep(res.data);
    temData.current_stay = newPatientData.current_unit_stay;
    delete newPatientData.current_unit_stay;
    temData.current_stay.patient = newPatientData;
    if (setParentData) {
      setParentData(temData);
    } else {
      setDataCopy(temData);
    }
    fullForm || setPage(`/patient/${res.data.id}`);
  };

  const onSubmitRemoveSuccess = (res) => {
    console.log("Data returned", res);
    parentUiInform &&
      parentUiInform(
        `${patient.firstName} ${patient.lastName} retiré`,
        "success"
      );
    setLoading(false);
    closeDial();

    let newBedData = Object.assign(_.cloneDeep(dataCopy), {
      current_stay: null,
    });
    if (setParentData) {
      setParentData(newBedData);
    } else {
      setDataCopy(newBedData);
    }

    if (setParentData) {
      let temData = _.cloneDeep(dataCopy);
      temData.current_stay = null;
      setParentData(temData);
    } else {
    }
  };

  const onSubmitFail = (err) => {
    setLoading(false);
    manageError(err.response, parentUiInform);
  };

  const submitAddPatient = () => {
    setLoading(true);
    processSubmitAddPatient &&
      processSubmitAddPatient(formData, onSubmitAddSuccess, onSubmitFail);
  };

  const submitRemovePatientFromBed = () => {
    setLoading(true);
    processSubmitRemovePatient &&
      processSubmitRemovePatient(formData, onSubmitRemoveSuccess, onSubmitFail);
  };

  // const updateTodoList = (todoListData) => {
  //   if (setParentData) {
  //     let temData = _.cloneDeep(dataCopy);
  //     temData.current_stay.patient.todo_list = todoListData.text;
  //     temData.current_stay.patient.last_edited_todo_list = todoListData.lastEdited;
  //     setParentData(temData);
  //   }
  // }

  let { id, current_stay, unit_index, status } = dataCopy;

  const patient = !current_stay
    ? null
    : {
        id: current_stay.patient.id,
        firstName: current_stay.patient.first_name,
        lastName: current_stay.patient.family_name,
        sex: current_stay.patient.sex,
        severity: severityInterface[current_stay.patient.severity],
        birthDate: new Date(current_stay.patient.birth_date),
        hospitalisationCause: current_stay.patient.hospitalisation_cause,
      };
  const patientStay = !current_stay
    ? null
    : {
        id: current_stay.id,
        startDate: new Date(current_stay.start_date),
      };

  const buildTodoList = !current_stay
    ? null
    : (variant) => (iconprops) => (
        <EditableText
          details={`Liste à penser pour le patient`}
          title="Todo list"
          variant={variant}
          data={{
            text: current_stay.patient.todo_list,
            lastEdited: new Date(current_stay.patient.last_edited_todo_list),
          }}
          readOnly
          interpretorVariant="checklist"
          customButton={(props) => (
            <IconButton variant="contained" {...props}>
              {icons.todoList(iconprops)}
            </IconButton>
          )}
          badgeCounter={howManyUnfilledTasksInMarkdown}
          parentUiInform={parentUiInform}
          mapResToData={getTextData("todo_list")}
          processSubmit={submitEditableText(
            "todo_list",
            current_stay.patient.id
          )}
        />
      );

  const failuresIcons = !current_stay
    ? null
    : [
        "heart_failure",
        "bio_chemical_failure",
        "brain_failure",
        "lung_failure",
        "kidney_failure",
        "liver_failure",
        "hematologic_failure",
      ]
        .filter((k) => current_stay.patient[k])
        .map((k) => icons[k]);

  return (
    <React.Fragment>
      <UnitBedPresentational
        patient={patient}
        patientStay={patientStay}
        bedId={id}
        unitIndex={unit_index}
        variantForBedItem={variantForBedItem}
        failuresIcons={failuresIcons}
        buildTodoList={buildTodoList}
        bedStatus={bedStatusInterface[status]}
        handlePatientClick={handlePatientClick}
        handleDialOpen={openDial}
        onSwapPatient={onSwapPatient}
        gardeMode={gardeMode}
      />
      <UnitBedDialog
        patient={patient}
        onCancel={cancelDial}
        removePatientFromBed={submitRemovePatientFromBed}
        addPatient={submitAddPatient}
        loading={loading}
        formProps={{
          schema: fullForm ? schemaAddPatient : schemaAddPatientSmall,
          uiSchema: uiSchemaAddPatient,
          formData: _.cloneDeep(formData),
          onChange: updateFormData,
          liveValidate: false,
        }}
        onKeyPress={handleKeyPress}
        fullForm={fullForm}
        changeFullForm={changeFullForm}
        open={dialOpen}
        onClose={closeDial}
      />
    </React.Fragment>
  );
}

UnitBed.propTypes = {
  bedData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    current_stay: PropTypes.object,
    unit_index: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
  }),
  setPage: PropTypes.func,
  processSubmitAddPatient: PropTypes.func,
  processSubmitRemovePatient: PropTypes.func,
  setParentData: PropTypes.func,
  parentUiInform: PropTypes.func,
  gardeMode: PropTypes.bool,
};

UnitBed.defaultProps = {
  gardeMode: false,
};

export default UnitBed;
