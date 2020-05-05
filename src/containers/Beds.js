import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import * as _ from "lodash";
import { connect } from "react-redux";

import { uiInform } from "../store/actions";

import ReanimationService from "../components/containers/ReanimationService";
import ReanimationTabs from "../components/containers/ReaTabs";
import BedsTemplate from "../templates/Beds";
import {
  submitAddReanimationService,
  submitRemoveReanimationService,
} from "../repository/reanimationService.repository";
import { submitMovePatient } from "../repository/bed.repository";
import SnackBar from "../components/SnackBar";

function ReanimationServices({ data, reFetch, uiInform, ...props }) {
  const [page, setPage] = useState();
  const [reaServicesData, setReaServicesData] = useState(data.results);

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
  };

  return page ? (
    <Redirect push to={page} />
  ) : (
    <BedsTemplate components={components} />
  );
}
const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  uiInform: (message, severity) => dispatch(uiInform(message, severity)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReanimationServices);
