import axios from "axios";
import config from "../config";

import jsonReas from "../shared/mocks/reas.json";

const DEV_MODE = process.env.REACT_APP_IS_DEV === "1";

export const submitAddReanimationService = () => {
  return (accessCode, thenCb, catchCb) => {
    const dataToSend = {
      reanimation_service_code: accessCode,
    };

    const url = `${config.path.bed}`;
    console.log(`Sending to: ${url}`, dataToSend);

    if (DEV_MODE) {
      thenCb({
        data: {
          count: 1,
          results: [jsonReas.results[1]]
        }
      });
      return;
    }

    axios
      .get(url, {
        params: dataToSend,
        ...config.axios,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then(thenCb)
      .catch(catchCb);
  };
};

export const submitRemoveReanimationService = () => {
  return (serviceId, thenCb, catchCb) => {
    const dataToSend = {
      action: "remove",
    };

    const url = `${config.path.bed}${serviceId}/`;
    console.log(`Sending to: ${url}`, dataToSend);

    if (DEV_MODE) {
      thenCb({ data: { removed: serviceId } });
      return;
    }

    axios({
      method: "patch",
      url,
      data: dataToSend,
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
