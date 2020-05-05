import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import SimpleSelectPresentational from "../presentational/SimpleSelect";

import { manageError } from "../../shared/utils/tools";

const SimpleSelect = ({
  title,
  values,
  icons,
  colors,
  setData,
  processSubmit,
  parentUiInform,
  readOnly,
  data,
  setParentData,
  mapResToData,
}) => {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);

  const onSubmitSuccess = (res) => {
    console.log("Data returned", res);
    parentUiInform && parentUiInform(`${title} mis à jour`, "success");
    setLoadingUpdate(false);

    let newData = mapResToData ? mapResToData(res.data) : res.data;
    if (setParentData) {
      setParentData(Object.assign(_.cloneDeep(dataCopy), newData));
    } else {
      setDataCopy(Object.assign(_.cloneDeep(dataCopy), newData));
    }
    setData && setData(res.data);
  };

  const onSubmitFail = (err) => {
    setLoadingUpdate(false);
    manageError(err.response, parentUiInform);
  };

  const onChange = (event) => {
    if (readOnly) return;
    setLoadingUpdate(true);
    processSubmit &&
      processSubmit(event.target.value, onSubmitSuccess, onSubmitFail);
  };

  console.log("Checking simple:", dataCopy);
  return (
    <React.Fragment>
      <SimpleSelectPresentational
        title={title}
        value={dataCopy.value}
        values={values}
        icon={Object.keys(icons).length ? icons[dataCopy.value] : <></>}
        color={colors[dataCopy.value]}
        onChange={onChange}
        readOnly={readOnly}
        loading={loadingUpdate}
      />
    </React.Fragment>
  );
};

SimpleSelect.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({ value: PropTypes.string }),
  values: PropTypes.object,
  icons: PropTypes.object,
  colors: PropTypes.object,
  readOnly: PropTypes.bool,
  setParentData: PropTypes.func,
  mapResToData: PropTypes.func,
  parentUiInform: PropTypes.func,
  processSubmit: PropTypes.func,
};

SimpleSelect.defaultProps = {
  data: {},
  values: {},
  icons: {},
  colors: {},
  readOnly: false,
};

export default SimpleSelect;
