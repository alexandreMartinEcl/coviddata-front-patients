import React from "react";
import PropTypes from "prop-types";

import ReanimationTabsPresentational from "../presentational/ReaTabs";
import { cloneSchema } from "../../shared/utils/schema";
import { manageError } from "../../shared/utils/tools";

const schemaAddRea = cloneSchema({
  title: "Assigner un nouveau service de réanimation",
  description: "Donner le code de l'unité donné par l'AP-HP",
  type: "object",
  required: ["reanimation_service_code"],
  properties: {
    reanimation_service_code: {
      type: "string",
      title: "Code d'accès",
      maxLength: 10,
    },
  },
}).schema;

const uiSchemaAddRea = {
  reanimation_service_code: {
    "ui:autofocus": true,
  },
};

const ReanimationTabs = ({
  labels,
  servicesIds,
  contents,
  processSubmitAdd,
  processSubmitRemove,
  onTabChange,
  setData,
  parentUiInform,
}) => {
  const [formData, setFormData] = React.useState({});
  const [tabValue, setTabValue] = React.useState(
    Number(localStorage.getItem("currentReaTab")) || 0
  );
  const [loading, setLoading] = React.useState(false);
  const [dialOpen, setDialOpen] = React.useState(false);
  const [reaToRemove, setReaToRemove] = React.useState({});
  const [removeDialOpen, setRemoveDialOpen] = React.useState(false);

  const closeDial = () => setDialOpen(false);

  const cancelDial = () => {
    setFormData({});
    closeDial();
  };

  const updateFormData = (fData) => {
    setFormData(fData.formData);
  };

  const openDial = () => setDialOpen(true);

  const openRemoveDial = (serviceId) => {
    return () => {
      setReaToRemove(labels.find((l) => l.serviceId === serviceId));
      setRemoveDialOpen(true);
    };
  };
  const closeRemoveDial = () => setRemoveDialOpen(false);

  const handleChange = (newValue) => {
    setTabValue(newValue);
    localStorage.setItem("currentReaTab", newValue);
    onTabChange && onTabChange(labels[newValue].title);
  };

  const onSubmitSuccessAdd = (res) => {
    console.log("Data returned", res);
    if (res.data.count === 0) {
      parentUiInform &&
        parentUiInform("Aucune unité n'a été trouvée avec ce code", "error");
    } else {
      let newServiceId = res.data.results[0].id;
      if (servicesIds.find((i) => newServiceId === i)) {
        parentUiInform &&
          parentUiInform(
            `${res.data.results[0].name} a déjà été récupérée`,
            "warning"
          );
      } else {
        parentUiInform &&
          parentUiInform(
            `${res.data.results[0].name} a été récupérée`,
            "success"
          );
        setData && setData(res.data.results[0]);
      }
      closeDial();
    }
    setLoading(false);
  };

  const onSubmitSuccessRemove = (res) => {
    console.log("Data returned", res);
    parentUiInform && parentUiInform("Accès à l'unité retiré", "success");
    setData && setData({ remove: res.data.removed });
    setLoading(false);
    closeRemoveDial();
  };

  const onSubmitFail = (err) => {
    setLoading(false);
    manageError(err.response, parentUiInform);
  };

  const onSubmitAddRea = () => {
    setLoading(true);
    console.log(formData);

    processSubmitAdd &&
      processSubmitAdd(
        formData.reanimation_service_code,
        onSubmitSuccessAdd,
        onSubmitFail
      );
  };

  const onSubmitRemoveRea = (serviceId) => {
    return () => {
      console.log(formData);
      processSubmitRemove &&
        processSubmitRemove(serviceId, onSubmitSuccessRemove, onSubmitFail);
    };
  };

  return (
    <React.Fragment>
      <ReanimationTabsPresentational
        labels={labels}
        contents={contents}
        onTabChange={handleChange}
        removeTab={onSubmitRemoveRea}
        tabValue={tabValue < labels.length ? tabValue : 0}
        formProps={{
          liveValidate: true,
          schema: schemaAddRea,
          uiSchema: uiSchemaAddRea,
          formData: formData,
          onChange: updateFormData,
        }}
        dialOpen={dialOpen}
        cancelDial={cancelDial}
        closeDial={closeDial}
        openDial={openDial}
        loading={loading}
        addRea={onSubmitAddRea}
        openRemoveDial={openRemoveDial}
        cancelRemoveDial={closeRemoveDial}
        removeDialOpen={removeDialOpen}
        reaToRemove={reaToRemove}
      />
    </React.Fragment>
  );
};

ReanimationTabs.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  servicesIds: PropTypes.arrayOf(PropTypes.number),
  contents: PropTypes.arrayOf(PropTypes.element),
  processSubmitAdd: PropTypes.func,
  processSubmitRemove: PropTypes.func,
  onTabChange: PropTypes.func,
  setData: PropTypes.func,
  parentUiInform: PropTypes.func,
};

export default ReanimationTabs;
