import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import * as _ from "lodash";

import ReanimationService from "../components/containers/ReanimationService";
import ReanimationTabs from "../components/containers/ReaTabs";
import BedsTemplate from "../templates/Beds";
import {
  submitAddReanimationService,
  submitRemoveReanimationService,
} from "../repository/reanimationService.repository";
import { submitMovePatient } from "../repository/bed.repository";
import SnackBar from "../components/SnackBar";

function ReanimationServices({ data, reFetch, ...props }) {
  const [page, setPage] = useState();
  const [reaServicesData, setReaServicesData] = useState(data.results);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [infoMsg, setInfoMsg] = React.useState("");

  /**
   * Display information snackbar
   * @param {string} msg
   * @param {string} infoType either 'success', 'error', 'info' or 'warning'
   */
  const uiInform = (msg, infoType) => {
    setInfoMsg(msg);
    setSnackbarSeverity(infoType);
    setSnackbarOpen(true);
  };

  const closeSnackBar = () => {
    setSnackbarOpen(false);
    setInfoMsg("");
  };

  const updateData = (update) => {
    const temData = _.cloneDeep(reaServicesData);
    if (update.remove) {
      setReaServicesData(
        temData.filter((service) => service.id !== update.remove)
      );
    } else {
      temData.push(update);
      setReaServicesData(temData);
    }
  };

  const updateReanimationServiceData = (serviceId) => {
    return (newServiceData) => {
      const temData = _.cloneDeep(reaServicesData);
      temData.forEach((service) => {
        if (service.id === serviceId) {
          service.units = newServiceData.units;
        }
      });
      setReaServicesData(temData);
    };
  };

  const getLabels = (services) => {
    return services.map((service, id) =>
      Object.assign(
        {},
        { title: service.name, tabId: id, serviceId: service.id }
      )
    );
  };

  const getServicesIds = (services) => {
    return services.map((service) => service.id);
  };

  const getContents = (services) => {
    return services.map((service, id) => {
      return {
        id: id,
        toRender: (
          <ReanimationService
            key={service.id}
            reFetch={reFetch}
            serviceData={service}
            setData={updateReanimationServiceData(service.id)}
            setPage={setPage}
            processSubmitSwap={submitMovePatient()}
            parentUiInform={uiInform}
          />
        ),
      };
    });
  };

  const components = {
    ReanimationServices: (props) => (
      <ReanimationTabs
        labels={getLabels(reaServicesData)}
        contents={getContents(reaServicesData)}
        servicesIds={getServicesIds(reaServicesData)}
        processSubmitAdd={submitAddReanimationService()}
        processSubmitRemove={submitRemoveReanimationService()}
        setData={updateData}
        parentUiInform={uiInform}
        {...props}
      />
    ),
    Snackbar: (props) => (
      <SnackBar
        open={snackbarOpen}
        onClose={closeSnackBar}
        severity={snackbarSeverity}
        infoMsg={infoMsg}
        {...props}
      />
    ),
  };

  return page ? (
    <Redirect push to={page} />
  ) : (
    <BedsTemplate components={components} />
  );
}

export default ReanimationServices;
