import axios from "axios";
import config from "../config";

const DEV_MODE = process.env.REACT_APP_IS_DEV === "1";

export const submitFreeUpBed = () => {
  return (stayId, thenCb, catchCb) => {
    const dataToSend = new FormData();
    dataToSend.append("terminate", true);
    const url = `${config.path.stay}${stayId}/`;
    console.log(`Sending to: ${url}`, Array.from(dataToSend.entries()));

    if (DEV_MODE) {
      thenCb({ data: { success: true } });
      return;
    }

    axios({
      method: "patch",
      url,
      data: dataToSend,
      ...config.axios,
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(thenCb)
      .catch(catchCb);
  };
};

export const submitMovePatient = () => {
  //patient props are described in components/presentational/UnitBed
  return (unitStay, newBedId, isSwaping, thenCb, catchCb) => {
    const jsonData = {
      swap: isSwaping,
      id_bed: newBedId,
    };

    const url = `${config.path.stay}${unitStay.id}/`;
    console.log(`Sending to: ${url}`, jsonData);

    if (DEV_MODE) {
      thenCb({ data: { success: true } });
      return;
    }

    axios({
      method: "patch",
      url,
      data: jsonData,
      ...config.axios,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(thenCb)
      .catch(catchCb);
  };
};

const basicBedInfo = (bed) => {
  let patient = !bed.current_stay ? null : bed.current_stay.patient;
  return !patient
    ? ""
    : `${bed.unit_index} - ${patient.first_name} ${patient.family_name}`;
};

const buildBedTodoListMarkdownSummary = (bed) => {
  if (!bed.current_stay) return "";
  let toBeDone = bed.current_stay.patient.todo_list
    .split(`\n`)
    .filter((r) => r.match(/^\- \[ \].*$/g))
    .join(`\n`);
  if (!toBeDone) return "";

  return `#### ${basicBedInfo(bed)}\n${toBeDone}\n`;
};

export const buildUnitTodoListSummary = (unit) => {
  let res = "";
  let lastEdited;
  unit.beds.forEach((bed) => {
    if (!bed.current_stay) return "";
    let patientLastEdited = new Date(
      bed.current_stay.patient.last_edited_todo_list
    );
    if (!lastEdited || patientLastEdited > lastEdited)
      lastEdited = patientLastEdited;

    res = `${res}${buildBedTodoListMarkdownSummary(bed)}`;
  });
  return {
    text: res,
    lastEdited: lastEdited,
  };
};

export const buildReaServiceTodoListSummary = (service) => {
  let res = "";
  let lastEdited;
  service.units.forEach((unit) => {
    let unitSummary = buildUnitTodoListSummary(unit);
    if (!lastEdited || unitSummary.lastEdited > lastEdited)
      lastEdited = unitSummary.lastEdited;

    res = `${res}## ${unit.name}\n${unitSummary.text}`;
  });
  return {
    text: res,
    lastEdited: lastEdited,
  };
};
