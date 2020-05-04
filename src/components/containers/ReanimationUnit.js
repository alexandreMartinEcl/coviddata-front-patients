import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";

import ReanimationUnitPresentational from "../presentational/ReanimationUnit";
import { BedIcon, ToWatchIcon, TodoListIcon } from "../../shared/icons/index";
import { submitAddPatient } from "../../repository/patient.repository";
import {
  submitFreeUpBed,
  buildUnitTodoListSummary,
} from "../../repository/bed.repository";
import UnitBed from "./UnitBed";
import EditableText from "./EditableText";
import { IconButton } from "@material-ui/core";
import { howManyUnfilledTasksInMarkdown } from "../../shared/utils/tools";
import ReanimationService from "./ReanimationService";

const icons = {
  bed: (props) => <BedIcon {...props} />,
  toWatch: (props) => <ToWatchIcon {...props} />,
  todoList: (props) => <TodoListIcon {...props} />,
};

const ReanimationUnit = ({
  unitData,
  reFetch,
  onSwapPatient,
  setPage,
  setParentData,
  parentUiInform,
  gardeMode,
}) => {
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(unitData));

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
      let newUnitData = _.cloneDeep(dataCopy);
      let bed = newUnitData.beds.find((b) => b.id === bedId);
      Object.assign(bed, newBedData);
      if (setParentData) {
        setParentData(Object.assign(_.cloneDeep(dataCopy), newUnitData));
      } else {
        setDataCopy(Object.assign(_.cloneDeep(dataCopy), newUnitData));
      }
    };
  };

  const todoIcon = (unit) => (iconprops) => (
    <EditableText
      details={`Liste à penser pour l'unite ${unit.name}`}
      title="Todo list"
      variant="dial"
      data={buildUnitTodoListSummary(unit)}
      readOnly
      interpretorVariant="markdown"
      customButton={(props) => (
        <IconButton variant="contained" {...props}>
          {icons.todoList(iconprops)}
        </IconButton>
      )}
      badgeCounter={howManyUnfilledTasksInMarkdown}
      parentUiInform={parentUiInform}
    />
  );

  return (
    <ReanimationUnitPresentational
      name={dataCopy.name}
      nbSevere={computeNbSeverePatients(dataCopy.beds)}
      nbAvailable={computeNbAvailableBeds(dataCopy.beds)}
      IconSevere={icons.toWatch}
      IconBed={icons.bed}
      TodoListIcon={todoIcon(dataCopy)}
      gardeMode={gardeMode}
      bedElements={dataCopy.beds
        .sort((a, b) => a.unit_index >= b.unit_index)
        .map((bed) => (
          <UnitBed
            key={bed.id}
            bedData={bed}
            setPage={setPage}
            setParentData={setBedData(bed.id)}
            onSwapPatient={onSwapPatient}
            processSubmitAddPatient={submitAddPatient(bed.id)}
            processSubmitRemovePatient={submitFreeUpBed()}
            setData={setBedData(bed.id)}
            parentUiInform={parentUiInform}
            gardeMode={gardeMode}
          />
        ))}
    />
  );
};

ReanimationUnit.propTypes = {
  unitData: PropTypes.object,
  reFetch: PropTypes.func,
  setPage: PropTypes.func,
  setParentData: PropTypes.func,
  parentUiInform: PropTypes.func,
  gardeMode: PropTypes.bool,
};

ReanimationUnit.defaultProps = {
  gardeMode: false,
};
export default ReanimationUnit;
