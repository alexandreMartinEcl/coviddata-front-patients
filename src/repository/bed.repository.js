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
