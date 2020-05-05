import React from "react";
import PropTypes from "prop-types";

import DemographicDisplayPresentational from "../presentational/DemographicDisplay";

import { getAge } from "../../shared/utils/date";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import { manageError } from "../../shared/utils/tools";
import * as _ from "lodash";

//TOOD should be automated using jsonSchema but not that simple
const checkAddPatientForm = (field, value) => {
  switch (field) {
    case "NIP_id":
      return value.match(/^[0-9]*$/g);
    case "current_unit_stay/start_date":
      return new Date(value) <= new Date();
    case "family_name":
      return value.match(/^[a-zA-Z\-']*$/g);
    case "first_name":
      return value.match(/^[a-zA-Z\-']*$/g);
    case "birth_date":
      return new Date(value) <= new Date();
    case "weight_kg":
      return value.match(/^[0-9]{0,3}(\.[0-9]{0,3})?$/g);
    case "size_cm":
      return value.match(/^[0-9]{0,3}(\.[0-9]{0,2})?$/g);
    default:
      return true;
  }
};

const DemographicDisplay = ({
  readOnly,
  parentUiInform,
  processSubmit,
  data,
  setParentData,
  mapResToData,
}) => {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [editedData, setEditedData] = React.useState(_.cloneDeep(data));

  const [isEditable, setIsEditable] = React.useState(_.cloneDeep(false));
  const [cellFocus, setCellFocus] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const handleKeyPress = (event) => {
    if (!isEditable) return;
    switch (event.key) {
      case "Enter":
        onSubmit();
        break;
      case "Escape":
        onCancel();
        break;
      default:
        return;
    }
  };
  const th = useTheme();
  const isUpSm = useMediaQuery(th.breakpoints.up("sm"));
  const variantHeaderContent = isUpSm ? "body1" : "body2";

  const makeEditable = (focus = "") => {
    if (!readOnly) {
      setCellFocus(focus);
      setEditedData(_.cloneDeep(dataCopy));
      setIsEditable(true);
    }
  };

  const makeUneditable = () => {
    setIsEditable(false);
  };

  const onCancel = () => {
    setEditedData(_.cloneDeep(data));
    makeUneditable();
  };

  const onFieldChange = (field) => {
    return ({target}) => {
      let { value } = target;
      if (!checkAddPatientForm(field, value)) return;
      let temEditedData = _.cloneDeep(editedData);
      let keys = field.split("/");
      if (keys.length > 1) {
        temEditedData[keys[0]][keys[1]] = value;
      } else {
        temEditedData[field] = value;
      }
      setEditedData(_.cloneDeep(temEditedData));
    };
  };

  const sexInterface = {
    H: "Homme",
    F: "Femme",
  };

  const buildIMC = (weight, size) => {
    return `(IMC: 
      ${(weight / (size / 100) ** 2).toFixed(2) || "?"})`;
  };

  const onSubmitSuccess = (res) => {
    console.log("Data returned", res);
    parentUiInform &&
      parentUiInform(`Infos démographiques mises à jour`, "success");
    setLoading(false);
    makeUneditable();
    let newData = mapResToData ? mapResToData(res.data) : res.data;
    if (setParentData) {
      setParentData(Object.assign(_.cloneDeep(dataCopy), newData));
    } else {
      setDataCopy(Object.assign(_.cloneDeep(dataCopy), newData));
    }
  };

  const onSubmitFail = (err) => {
    setLoading(false);
    manageError(err.response, parentUiInform);
  };

  const onSubmit = () => {
    setLoading(true);
    processSubmit && processSubmit(editedData, onSubmitSuccess, onSubmitFail);
  };

  return (
    <React.Fragment>
      <DemographicDisplayPresentational
        unitStay={editedData.current_unit_stay}
        // hospitalisationDate={new Date(editedData.hospitalisationDate)}
        isEditable={isEditable}
        nipId={editedData.NIP_id}
        familyName={editedData.family_name}
        firstName={editedData.first_name}
        sex={editedData.sex}
        sexInterface={sexInterface}
        birthDate={editedData.birth_date}
        toAddBirthDate={`(${getAge(data.birth_date)} ans)`}
        weight={editedData.weight_kg}
        size={editedData.size_cm}
        toAddSize={buildIMC(data.weight_kg, data.size_cm)}
        hospitalisationCause={editedData.hospitalisation_cause}
        readOnly={readOnly}
        cellFocus={cellFocus}
        variantHeaderContent={variantHeaderContent}
        onFieldChange={onFieldChange}
        handleKeyPress={handleKeyPress}
        makeEditable={makeEditable}
        onCancel={onCancel}
        onSubmit={onSubmit}
        loading={loading}
      />
    </React.Fragment>
  );
};

DemographicDisplay.propTypes = {
  data: PropTypes.object,
  readOnly: PropTypes.bool,
  setParentData: PropTypes.func,
  processSubmit: PropTypes.func,
  parentUiInform: PropTypes.func,
  mapResToData: PropTypes.func,
};

DemographicDisplay.defaultProps = {
  data: {},
  readOnly: false,
};

export default DemographicDisplay;
