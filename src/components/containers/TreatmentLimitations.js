import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import TreatmentLimitationsPresentational from "../presentational/TreatmentLimitations";
import inputsFormat from "../../json/treatmentLimitationsInputs.json";

import { dateTimeToStr } from "../../shared/utils/date";

import { manageError } from "../../shared/utils/tools";

const checkFormData = (field, value) => {
  switch (field) {
    case "fio2_limit":
      return value.match(/^[0-9]{0,2}(\.[0-9]{0,5})?$/g);
    case "amines_limitation":
      return value.match(/^[0-9]{0,5}(\.[0-9]{0,5})?$/g);
    default:
      return true;
  }
};

const TreatmentLimitations = ({
  parentUiInform,
  buttonIcon,
  customButton,
  readOnly,
  processSubmit,
  data,
  setParentData,
  mapResToData,
}) => {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [editedData, setEditedData] = React.useState(_.cloneDeep(data));

  const [changeCheck, setChangeCheck] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [dialOpen, setDialOpen] = React.useState(false);

  const closeDial = () => {
    setDialOpen(false);
  };

  const cancelDial = () => {
    setChangeCheck(false);
    setEditedData(Object.assign(_.cloneDeep(editedData), dataCopy));
    closeDial();
  };

  const openDial = () => {
    setDialOpen(true);
  };

  const onChange = (field, isCheckbox) => ({ target }) => {
    let value = isCheckbox ? target.checked : target.value;
    if (!checkFormData(field, value)) return;
    let temData = Object.assign(_.cloneDeep(editedData), {
      [`${field}`]: value,
    });
    setChangeCheck(!_.isEqual(temData, dataCopy));
    setEditedData(Object.assign(_.cloneDeep(temData)));
  };

  let inputs;
  const buildInputs = (latData) => {
    if (inputs) return inputs;
    inputs = _.cloneDeep(inputsFormat).map((inputSet) => {
      return Object.assign(inputSet, {
        inputs: inputSet.inputs.map((input) =>
          Object.assign(input, { value: latData[input.field] })
        ),
      });
    });
    return inputs;
  };

  const buildBadgeCount = (latData) => {
    let tInputs = buildInputs(latData);
    return tInputs.reduce((setA, setB) => {
      setA = _.cloneDeep(setA);
      setA.checkedCount =
        typeof setA.checkedCount !== "undefined"
          ? setA.checkedCount
          : setA.inputs.filter((i) => i.value).length;
      let checkedCountB = setB.inputs.filter((i) => i.value).length;
      return { checkedCount: setA.checkedCount + checkedCountB };
    }).checkedCount;
  };

  const onSubmitSuccess = (res) => {
    console.log("Data returned", res);

    parentUiInform &&
      parentUiInform(`Limitations de traitement mis à jour`, "success");
    setLoading(false);
    closeDial();
    let newData = mapResToData ? mapResToData(res.data) : res.data;
    if (setParentData) {
      setParentData(Object.assign(_.cloneDeep(dataCopy), newData));
    } else {
      setDataCopy(Object.assign(_.cloneDeep(dataCopy), newData));
      setChangeCheck(false);
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
      <TreatmentLimitationsPresentational
        readOnly={readOnly}
        strLastEdited={dateTimeToStr(dataCopy.lastEdited)}
        inputs={buildInputs(editedData)}
        onChange={onChange}
        cancelDial={cancelDial}
        closeDial={closeDial}
        openDial={openDial}
        onSubmit={onSubmit}
        loading={loading}
        open={dialOpen}
        customButton={customButton}
        badgeCount={buildBadgeCount(editedData)}
        buttonIcon={buttonIcon}
        changeCheck={changeCheck}
      />
    </React.Fragment>
  );
};

TreatmentLimitations.propTypes = {
  parentUiInform: PropTypes.func,
  buttonIcon: PropTypes.element,
  customButton: PropTypes.func,
  readOnly: PropTypes.bool,
  processSubmit: PropTypes.func,
  data: PropTypes.object,
  setParentData: PropTypes.func,
  mapResToData: PropTypes.func,
};

TreatmentLimitations.defaultProps = {
  readOnly: false,
};

export default TreatmentLimitations;
