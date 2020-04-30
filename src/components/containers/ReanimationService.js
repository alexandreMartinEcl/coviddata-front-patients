import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import {
  ReanimationServicePresentational,
  BedSwapDial,
} from "../presentational/ReanimationService";

import { BedIcon, ToWatchIcon } from "../../shared/icons/index";
import ReanimationUnit from "./ReanimationUnit";
import { manageError } from "../../shared/utils/tools";

const icons = {
  bed: <BedIcon color="secondary" style={{ width: "30px", height: "100%" }} />,
  toWatch: (
    <ToWatchIcon color="secondary" style={{ width: "30px", height: "100%" }} />
  ),
};

const schemaSwapBed = {
  title: "Déplacer le patient",
  description: "Choisissez un nouveau lit",
  type: "object",
  required: ["reanimation_service_code"],
  properties: {
    bed_id: {
      type: "number",
      title: "Code d'accès",
      enum: [],
      enumNames: [],
    },
  },
  /**
   *
   * @param {Array<Number>} values
   * @param {Array<String>} names
   */
  updateBedId: function (values, names) {
    this.properties.bed_id.enum = values;
    this.properties.bed_id.enumNames = names;
  },
  withData: function (patient, beds) {
    if (!patient) return this;

    beds = beds.filter(
      (b) => !b.current_stay || b.current_stay.patient.id !== patient.id
    );

    const displayName = (p) => {
      return `${p.first_name} ${p.family_name}`;
    };
    const bedSimpleDescription = (bed) => {
      return `${bed.unitName} - ${bed.unit_index} - ${
        bed.current_stay ? displayName(bed.current_stay.patient) : "Libre"
      }`;
    };

    let _schema = _.cloneDeep(this);
    _schema.title = `Déplacer ${patient.firstName} ${patient.lastName}`;
    _schema.updateBedId(
      beds.map((b) => b.id),
      beds.map((b) => bedSimpleDescription(b))
    );
    return _schema;
  },
};

const uiSchemaSwapBed = {
  bed_id: {
    "ui:autofocus": true,
  },
};

function ReanimationService({
  serviceData,
  setData,
  setPage,
  processSubmitSwap,
  parentUiInform,
  reFetch,
}) {
  const [loading, setLoading] = React.useState(false);
  const [swapDialOpen, setSwapDialOpen] = React.useState(false);
  const [patientToMove, setPatientToMove] = React.useState();
  const [unitStayToUpdate, setUnitStayToUpdate] = React.useState();
  const [formData, setFormData] = React.useState({});

  const closeSwapDial = () => setSwapDialOpen(false);

  const updateFormData = (fData) => {
    setFormData(fData.formData);
  };

  const launchPatientSwapDial = (targetPatient, targetStay) => {
    return () => {
      setUnitStayToUpdate(targetStay);
      setPatientToMove(targetPatient);
      setSwapDialOpen(true);
    };
  };

  let reaListBeds;
  /**
   *
   * @param {object} rea
   * @returns {Array<object>}
   */
  const getReaListBeds = (rea) => {
    const addUnitName = (name) => {
      return (bed) => (bed.unitName && name ? bed : { ...bed, unitName: name });
    };
    reaListBeds = reaListBeds
      ? reaListBeds
      : rea.units.reduce((a, b) => {
          let t = a.beds.slice(0).map(addUnitName(a.name));
          t.splice(-1, 0, ...b.beds.map(addUnitName(b.name)));
          return { beds: t };
        }).beds;
    return reaListBeds;
  };

  let availableBeds;

  const formDataBedIdIsUsed = (fData) => {
    return (
      availableBeds &&
      fData.bed_id &&
      !availableBeds.find((b) => b.id === fData.bed_id)
    );
  };

  const computeNbSeverePatients = (rea) => {
    let beds = getReaListBeds(rea);
    return beds.filter(
      (b) => b.current_stay && b.current_stay.patient.severity === 0
    ).length;
  };

  const computeNbAvailableBeds = (rea) => {
    let beds = getReaListBeds(rea);
    availableBeds = availableBeds || beds.filter((b) => !b.current_stay);
    return availableBeds.length;
  };

  const buildInfos = (service) => {
    return [
      {
        title: "Patients à gravité haute",
        icon: icons.toWatch,
        value: computeNbSeverePatients(service),
      },
      {
        title: "Lits libres",
        icon: icons.bed,
        value: computeNbAvailableBeds(service),
      },
    ];
  };

  const setServiceData = (unitId) => {
    return (newUnitData) => {
      let newServiceData = _.cloneDeep(serviceData);
      newServiceData.units.forEach((temUnit) => {
        if (temUnit.id === unitId) {
          temUnit.beds = newUnitData.beds;
        }
      });
      setData(newServiceData);
    };
  };

  const onSubmitSuccess = (res) => {
    console.log("Data returned", res);

    parentUiInform && parentUiInform(`Patient(s) déplacé(s)`, "success");
    setLoading(false);
    closeSwapDial();
    reFetch();
  };

  const onSubmitFail = (err) => {
    setLoading(false);
    manageError(err.response, parentUiInform);
  };

  const submitSwapDial = () => {
    setLoading(true);
    processSubmitSwap &&
      processSubmitSwap(
        unitStayToUpdate,
        formData.bed_id,
        formDataBedIdIsUsed(formData),
        onSubmitSuccess,
        onSubmitFail
      );
  };

  return (
    <React.Fragment>
      <ReanimationServicePresentational
        infos={buildInfos(serviceData)}
        units={serviceData.units.map((unit) => (
          <ReanimationUnit
            key={unit.id}
            unitData={unit}
            setData={setServiceData(unit.id)}
            onSwapPatient={launchPatientSwapDial}
            setPage={setPage}
            reFetch={reFetch}
            parentUiInform={parentUiInform}
          />
        ))}
      />
      <BedSwapDial
        formProps={{
          schema: schemaSwapBed.withData(
            patientToMove,
            getReaListBeds(serviceData)
          ),
          uiSchema: uiSchemaSwapBed,
          formData: formData,
          onChange: updateFormData,
        }}
        patient={patientToMove}
        swaping={formDataBedIdIsUsed(formData)}
        onCancel={closeSwapDial}
        onSubmit={submitSwapDial}
        loading={loading}
        open={swapDialOpen}
      />
    </React.Fragment>
  );
}

ReanimationService.propTypes = {
  serviceData: PropTypes.object,
  setData: PropTypes.func,
  setPage: PropTypes.func,
  processSubmitSwap: PropTypes.func,
  parentUiInform: PropTypes.func,
  reFetch: PropTypes.func,
};

export default ReanimationService;
