import React from "react";
import PropTypes from "prop-types";

import DemographicDisplayPresentational from "../presentational/DemographicDisplay";

import { getAge } from "../../shared/utils/date";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import { manageError } from "../../shared/utils/tools";
import * as _ from "lodash";

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

  const makeUnEditable = () => {
    setIsEditable(false);
  };

  const onCancel = () => {
    setEditedData(_.cloneDeep(data));
    makeUnEditable();
  };

  const onFieldChange = (field) => {
    return (event) => {
      let temEditedData = _.cloneDeep(editedData);
      let keys = field.split("/");
      if (keys.length > 1) {
        temEditedData[keys[0]][keys[1]] = event.target.value;
      } else {
        temEditedData[field] = event.target.value;
      }
      setCellFocus(field);
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
    makeUnEditable();
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
