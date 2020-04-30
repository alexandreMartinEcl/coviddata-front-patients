import axios from "axios";
import config from "../config";
import * as _ from "lodash";
import { flat } from "../shared/utils/schema";

const DEV_MODE = process.env.REACT_APP_IS_DEV === "1";

export const splitPatientData = (fullData) => {
  // const dataPatientInfo = {
  //     first_name,
  //     family_name,
  //     birth_date,
  //     weight_kg,
  //     size_cm,
  //     NIP_id,
  //     sex,
  //     severity,
  //     current_unit_stay,
  //     hospitalisation_cause,
  // } = fullData;
  // const { unit_stays } = fullData;
  // if (unit_stays && unit_stays.length) {
  //     dataPatientInfo.hospitalisationDate = new Date(
  //         Math.min(...unit_stays.map((s) => new Date(s.start_date)))
  //     );
  // }
  // const {
  //     detection_weekly_orls,
  //     detection_weekly_ERs,
  // } = fullData;
  // const dataCheckList = {
  //     detection_covid,
  //     detection_orl_entree,
  //     detection_ER_entree,
  // } = fullData;
  // const depistageInterface = {
  //     detection_covid: "Détection Covid",
  //     detection_orl_entree: "Détection Orl d'entrée",
  //     detection_ER_entree: "Détection ER d'entrée",
  // };
  // if (dataPatientInfo.hospitalisationDate) {
  //     [...Array(nbWeeksBetween(dataPatientInfo.hospitalisationDate, new Date())).keys()].forEach((i) => {
  //         dataCheckList[`detection_ER_weekly_${i + 1}`] = (detection_weekly_ERs && detection_weekly_ERs[i]) ? detection_weekly_ERs[i] : false;
  //         dataCheckList[`detection_orl_weekly_${i + 1}`] = (detection_weekly_orls && detection_weekly_orls[i]) ? detection_weekly_orls[i] : false;
  //         depistageInterface[`detection_ER_weekly_${i + 1}`] = `Détection ER semaine ${i + 1}`;
  //         depistageInterface[`detection_orl_weekly_${i + 1}`] = `Détection Orl semaine ${i + 1}`;
  //     })
  // }
  // return { dataPatientInfo, dataCheckList}
};

export const submitDetectionChecklist = (nbWeeks, patientId) => {
  return (detections, thenCb, catchCb) => {
    let detections_ER_weekly = [...Array(nbWeeks).keys()].map((i) => false);
    let detections_orl_weekly = [...Array(nbWeeks).keys()].map((i) => false);
    Object.entries(detections).forEach(([k, v]) => {
      if (k.startsWith("detections_orl_weekly_"))
        detections_orl_weekly[k.split("_").pop() - 1] = v;
      if (k.startsWith("detections_ER_weekly_"))
        detections_ER_weekly[k.split("_").pop() - 1] = v;
    });

    let data = {
      detection_covid: detections.detection_covid,
      detection_orl_entree: detections.detection_orl_entree,
      detection_ER_entree: detections.detection_ER_entree,
      detections_ER_weekly: detections_ER_weekly,
      detections_orl_weekly: detections_orl_weekly,
    };
    const url = `${config.path.patient}${patientId}/`;
    console.log(`Sending to: ${url}`, data);

    if (DEV_MODE) {
      thenCb({ data: data });
      return;
    }

    axios({
      method: "patch",
      url,
      data: data,
      ...config.axios,
      headers: {
        "Content-Type": "Application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(thenCb)
      .catch(catchCb);
  };
};

export const submitFailureChecklist = (patientId) => {
  return (failures, thenCb, catchCb) => {
    const formData = new FormData();
    for (let [key, value] of Object.entries(failures)) {
      formData.append(key, value);
    }

    const url = `${config.path.patient}${patientId}/`;
    console.log(`Sending to: ${url}`, Array.from(formData.entries()));

    if (DEV_MODE) {
      thenCb({ data: failures });
      return;
    }

    axios({
      method: "patch",
      url,
      data: formData,
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

export const submitEditableText = (field, patientId) => {
  return (text, thenCb, catchCb) => {
    const formData = new FormData();
    formData.append(field, text);

    const url = `${config.path.patient}${patientId}/`;
    console.log(`Sending to: ${url}`, Array.from(formData.entries()));

    if (DEV_MODE) {
      thenCb({
        data: {
          [`${field}`]: text,
          [`last_edited_${field}`]: new Date(),
        }
      });
      return;
    }

    axios({
      method: "patch",
      url,
      data: formData,
      ...config.axios,
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(res => thenCb({
        data: {
          text: res.data[field],
          lastEdited: res.data[`last_edited_${field}`]
        }
      }))
      .catch(catchCb);
  };
};

export const submitLabelList = (field, variant, patientId) => {
  return (labels, thenCb, catchCb) => {
    let tempData;
    switch (variant) {
      case "double":
        tempData = {};
        labels
          .filter((i) => i.title.trim())
          .forEach((item) => {
            tempData[item.title.trim()] = item.value.trim();
          });
        break;
      default:
        tempData = labels.filter((i) => i.trim()).map((i) => i.trim());
    }

    let formData = {};
    formData[field] = JSON.stringify(tempData);
    const url = `${config.path.patient}${patientId}/`;
    console.log(`Sending to: ${url}`, field, tempData);

    if (DEV_MODE) {
      let resData = {};
      resData[field] = JSON.stringify(tempData);

      thenCb({ data: resData });
      return;
    }

    axios({
      method: "patch",
      url,
      data: formData,
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

export const submitSimpleSelect = (field, patientId) => {
  return (value, thenCb, catchCb) => {
    const formData = new FormData();
    formData.append(field, value);

    const url = `${config.path.patient}${patientId}/`;
    console.log(`Sending to: ${url}`, Array.from(formData.entries()));

    if (DEV_MODE) {
      let resData = {};
      resData[field] = value;
      thenCb({ data: resData });
      return;
    }

    axios({
      method: "patch",
      url,
      data: formData,
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

export const submitDemographicData = (patientId) => {
  return (data, thenCb, catchCb) => {
    let jsonData = _.cloneDeep(data);
    jsonData.stay_start_date = jsonData.current_unit_stay.start_date;
    delete jsonData.current_unit_stay;
    // delete jsonData.hospitalisationDate;

    const url = `${config.path.patient}${patientId}/`;
    console.log("Sending to:", url, jsonData);

    if (DEV_MODE) {
      thenCb({ data: data });
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

export const submitAddPatient = (bedId) => {
  return (patientData, thenCb, catchCb) => {
    const data = flat(patientData);
    const dataToSend = new FormData();

    for (let [key, value] of Object.entries(data)) {
      if (key === "stay_start_date") {
        // prevent from breaking if field has been emptied
        value && dataToSend.append(key, value);
      } else {
        dataToSend.append(key, value);
      }
    }
    dataToSend.append("bed", bedId);

    const url = config.path.patient;
    console.log(`Sending to: ${url}`, Array.from(dataToSend.entries()));

    if (DEV_MODE) {
      thenCb({
        data: {
          current_unit_stay: {
            id: 15,
            is_finished: false,
            bed_description: "",
            start_date: data.stay_start_date,
            end_date: null,
            created_by: "user1",
            bed: bedId,
          },
          ...patientData,
        },
      });
      return;
    }

    axios({
      method: "post",
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
