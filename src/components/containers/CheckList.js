import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";


import CheckListPresentational from "../presentational/CheckList";

import { manageError } from "../../shared/utils/tools";

const CheckList = ({
  title,
  customIcons,
  labels,
  parentUiInform,
  readOnly,
  processSubmit,
  data,
  setParentData,
  mapResToData,
}) => {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [editedData, setEditedData] = React.useState(_.cloneDeep(data));

  const [changeCheck, setChangeCheck] = React.useState(false);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  const handleChange = (value, field) => {
    if (readOnly) {
      return;
    }
    let temData = _.cloneDeep(editedData);
    temData[field] = value;
    setEditedData(_.cloneDeep(temData));
    setChangeCheck(!_.isEqual(temData, data));
  };

  const onCancel = () => {
    setEditedData(_.cloneDeep(data));
    setChangeCheck(false);
  };

  const onSubmitSuccess = (res) => {
    console.log(res);

    parentUiInform && parentUiInform(`${title} mis à jour`, "success");
    setLoadingUpdate(false);
    let newData = mapResToData ? mapResToData(res.data) : res.data;
    if (setParentData) {
      setParentData(Object.assign(_.cloneDeep(dataCopy), newData));
    } else {
      setDataCopy(Object.assign(_.cloneDeep(dataCopy), newData));
    }
    setChangeCheck(false);
  };

  const onSubmitFail = (err) => {
    setLoadingUpdate(false);
    manageError(err.response, parentUiInform);
  };

  const onSubmit = () => {
    setLoadingUpdate(true);
    processSubmit(_.cloneDeep(editedData), onSubmitSuccess, onSubmitFail);
  };

  console.log(data, editedData)
  return (
    <React.Fragment>
      <CheckListPresentational
        customIcons={customIcons}
        title={title}
        data={readOnly ? data : editedData}
        labels={labels}
        readOnly={readOnly}
        onSubmit={onSubmit}
        changeCheck={changeCheck}
        onChange={handleChange}
        onCancel={onCancel}
        loadingUpdate={loadingUpdate}
      />
    </React.Fragment>
  );
};

CheckList.propTypes = {
  title: PropTypes.string,
  customIcons: PropTypes.objectOf(PropTypes.element),
  labels: PropTypes.objectOf(PropTypes.string),
  data: PropTypes.objectOf(PropTypes.bool),
  setParentData: PropTypes.func,
  readOnly: PropTypes.bool,
  mapResToData: PropTypes.func,
  processSubmit: PropTypes.func,
  parentUiInform: PropTypes.func,
};

CheckList.defaultProps = {
  title: "",
  customIcons: {},
  labels: {},
  data: {},
  readOnly: false,
};

export default CheckList;
