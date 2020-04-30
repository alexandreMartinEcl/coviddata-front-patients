import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import ReanimationUnitPresentational from "../presentational/ReanimationUnit";
import { BedIcon, ToWatchIcon } from "../../shared/icons/index";
import { submitAddPatient } from "../../repository/patient.repository";
import { submitFreeUpBed } from "../../repository/bed.repository";
import UnitBed from "./UnitBed";

const icons = {
  bed: <BedIcon color="secondary" style={{ width: "30px", height: "100%" }} />,
  toWatch: (
    <ToWatchIcon color="secondary" style={{ width: "30px", height: "100%" }} />
  ),
};

const ReanimationUnit = ({
  unitData,
  reFetch,
  onSwapPatient,
  setPage,
  setData,
  parentUiInform,
}) => {
  const computeNbSeverePatients = (beds) => {
    return beds.filter(
      (b) => b.current_stay && b.current_stay.patient.severity === 0
    ).length;
  };

  const computeNbAvailableBeds = (beds) => {
    return beds.filter((b) => !b.current_stay).length;
  };

  const setBedData = (bedId) => {
    return (newBedData) => {
      let newUnitData = _.cloneDeep(unitData);
      let bed = newUnitData.beds.find(b => b.id === bedId);
      Object.assign(bed, newBedData);
      setData(newUnitData);
    };
  };

  return (
    <ReanimationUnitPresentational
      name={unitData.name}
      nbSevere={computeNbSeverePatients(unitData.beds)}
      nbAvailable={computeNbAvailableBeds(unitData.beds)}
      iconSevere={icons.toWatch}
      iconBed={icons.bed}
      bedElements={unitData.beds
        .sort((a, b) => a.unit_index >= b.unit_index)
        .map((bed) => (
          <UnitBed
            key={bed.id}
            bedData={bed}
            setPage={setPage}
            onSwapPatient={onSwapPatient}
            processSubmitAddPatient={submitAddPatient(bed.id)}
            processSubmitRemovePatient={submitFreeUpBed()}
            setData={setBedData(bed.id)}
            parentUiInform={parentUiInform}
          />
        ))}
    />
  );
};
ReanimationUnit.propTypes = {
  unitData: PropTypes.object,
  reFetch: PropTypes.func,
  setPage: PropTypes.func,
  setData: PropTypes.func,
  parentUiInform: PropTypes.func,
};

export default ReanimationUnit;
