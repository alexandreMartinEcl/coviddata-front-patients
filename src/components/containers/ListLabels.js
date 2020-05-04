import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import { ListLabelPresentational, LabelListDial } from "../presentational/ListLabels";

import { manageError } from "../../shared/utils/tools";

const ListLabels = ({
  title,
  labelVariant,
  parentUiInform,
  processSubmit,
  readOnly,
  data,
  setParentData,
  mapResToData,
}) => {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [editedData, setEditedData] = React.useState(_.cloneDeep(data));

  const [loading, setLoading] = React.useState(false);
  const [dialOpen, setDialOpen] = React.useState(false);

  const closeEditDial = () => {
    setDialOpen(false);
  };

  const cancelEditDial = () => {
    setEditedData(_.cloneDeep(dataCopy));
    closeEditDial();
  };

  const openEditDial = () => {
    setDialOpen(true);
  };

  const onChangeLabels = (index, field) => {
    return (event) => {
      let temListItems = _.cloneDeep(editedData.listItems);
      switch (labelVariant) {
        case "double":
          temListItems[index][field] = event.target.value;
          break;
        default:
          temListItems[index] = event.target.value;
          break;
      }
      setEditedData(
        Object.assign(_.cloneDeep(editedData), { listItems: temListItems })
      );
    };
  };

  const removeEditedLabel = (index) => {
    let temListItems = _.cloneDeep(editedData.listItems);
    temListItems.splice(index, 1);
    setEditedData(
      Object.assign(_.cloneDeep(editedData), { listItems: temListItems })
    );
  };

  const addEditedLabel = () => {
    let temListItems = _.cloneDeep(editedData.listItems);
    switch (labelVariant) {
      case "double":
        temListItems.push({ title: "", value: "" });
        setEditedData(
          Object.assign(_.cloneDeep(editedData), { listItems: temListItems })
        );
        break;
      default:
        temListItems.push("");
        setEditedData(
          Object.assign(_.cloneDeep(editedData), { listItems: temListItems })
        );
        break;
    }
  };

  const onSubmitSuccess = (res) => {
    console.log("Data returned", res);

    parentUiInform && parentUiInform(`${title} mis à jour`, "success");
    setLoading(false);
    closeEditDial();
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
    processSubmit &&
      processSubmit(editedData.listItems, onSubmitSuccess, onSubmitFail);
  };

  return (
    <React.Fragment>
      <ListLabelPresentational
        isEmpty={dataCopy.isEmpty}
        title={title}
        labelVariant={labelVariant}
        labels={dataCopy.listItems}
        readOnly={readOnly}
        openEditDial={openEditDial}
      />
      <LabelListDial
        title={title}
        labelVariant={labelVariant}
        editedLabels={editedData.listItems}
        addEditedLabel={addEditedLabel}
        onChangeLabels={onChangeLabels}
        removeEditedLabel={removeEditedLabel}
        dialOpen={dialOpen}
        closeEditDial={closeEditDial}
        cancelEditDial={cancelEditDial}
        onSubmitLabels={onSubmit}
        loading={loading}
      />
    </React.Fragment>
  );
};

ListLabels.propTypes = {
  title: PropTypes.string.isRequired,
  labelVariant: PropTypes.oneOf(["double", "single"]),
  data: PropTypes.shape({
    listItems: PropTypes.array,
    isEmpty: PropTypes.bool,
  }),
  setParentData: PropTypes.func,
  processSubmit: PropTypes.func,
  parentUiInform: PropTypes.func,
  mapResToData: PropTypes.func,
  readOnly: PropTypes.bool,
};

ListLabels.defaultProps = {
  labelVariant: "single",
  listItems: [],
  readOnly: false,
};

export default ListLabels;
