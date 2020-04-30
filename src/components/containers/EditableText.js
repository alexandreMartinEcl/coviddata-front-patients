import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import EditableTextPresentational from "../presentational/EditableText";

import { dateTimeToStr } from "../../shared/utils/date";

import { manageError } from "../../shared/utils/tools";

const EditableText = ({
  title,
  variant,
  interpretorVariant,
  parentUiInform,
  buttonIcon,
  customButton,
  badgeCounter,
  defaultNewLine = "",
  defaultText = "",
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
  const [autoFocus, setAutoFocus] = React.useState(false);

  const closeEditDial = () => {
    setAutoFocus(false);
    setDialOpen(false);
  };

  const cancelEditDial = () => {
    setEditedData(Object.assign(_.cloneDeep(editedData), { text: dataCopy.text }));
    closeEditDial();
  };

  const openEditDial = () => {
    setDialOpen(true);
    setAutoFocus(true);
  }

  const onChangeText = (event) => {
    setChangeCheck(event.target.value !== dataCopy.text)
    setEditedData(Object.assign(_.cloneDeep(editedData), { text: event.target.value }));
  }

  const changeFromCheckList = (rowId) => {
    return (event) => {
      let rows = editedData.text.split(`\n`);
      let row = rows[rowId];
      if (event.target.checked) {
        rows.splice(rowId, 1, row.replace("[ ]", "[x]"));
      } else {
        rows.splice(rowId, 1, row.replace("[x]", "[ ]"));
      }
      setEditedData(Object.assign(_.cloneDeep(data), { text: rows.join(`\n`) }));
    };
  };
  /**
   *
   * @param {KeyboardEvent} event
   */
  const handleKeyPress = (event) => {
    switch (event.key) {
      case "Enter":
        if (!defaultNewLine) return;
        let txt = event.target.value;
        let selectionStart = event.target.selectionStart;

        txt =
          txt.slice(0, event.target.selectionStart) +
          defaultNewLine +
          txt.slice(event.target.selectionEnd);
        event.target.value = txt;
        onChangeText(event);

        event.target.selectionStart = selectionStart + defaultNewLine.length;
        event.target.selectionEnd = event.target.selectionStart;
        //TODO tofix: this will prevent UNDO step (if we do Ctrl+z after this event, will not undo it)
        event.preventDefault();
        break;
      default:
        return;
    }
  };

  const buildBadgeCount = (str) => {
    if (!badgeCounter) return;
    return badgeCounter(str);
  };

  const onSubmitSuccess = (res) => {
    console.log("Data returned", res);

    parentUiInform && parentUiInform(`${title} mis à jour`, "success");
    setLoading(false);
    variant === "dial" && closeEditDial();
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
    processSubmit && processSubmit(editedData.text, onSubmitSuccess, onSubmitFail);
  };

  return (
    <React.Fragment>
      <EditableTextPresentational
        title={title}
        variant={variant}
        interpretorVariant={interpretorVariant}
        readOnly={readOnly}
        strLastEdited={dateTimeToStr(dataCopy.lastEdited)}
        text={editedData.text || defaultText}
        onChangeText={onChangeText}
        onChangeCheckList={changeFromCheckList}
        handleKeyPress={handleKeyPress}
        cancelEditDial={cancelEditDial}
        onSubmitText={onSubmit}
        loadingUpdateText={loading}
        openText={openEditDial}
        changeCheck={changeCheck}
        open={dialOpen}
        autoFocus={autoFocus}
        closeEditDial={closeEditDial}
        customButton={customButton}
        badgeCount={buildBadgeCount(data.text)}
        buttonIcon={buttonIcon}
      />
    </React.Fragment>
  );
};

EditableText.propTypes = {
  title: PropTypes.string,
  variant: PropTypes.oneOf(["extensible", "dial"]),
  interpretorVariant: PropTypes.oneOf(["markdown", "checklist", "none"]),
  data: PropTypes.shape({
    text: PropTypes.string,
    lastEdited: PropTypes.instanceOf(Date),
  }),
  parentUiInform: PropTypes.func,
  setParentData: PropTypes.func,
  readOnly: PropTypes.bool,
  badgeCounter: PropTypes.func,
  defaultNewLine: PropTypes.string,
  defaultText: PropTypes.string,
  processSubmit: PropTypes.func,
  mapResToData: PropTypes.func,
  customButton: PropTypes.func,
  buttonIcon: PropTypes.element,
};

EditableText.defaultProps = {
  variant: "extensible",
  withMarkdown: false,
  readOnly: false,
  data: {},
  defaultNewLine: "",
  defaultText: "",
};

export default EditableText;
