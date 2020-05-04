import React, { useEffect } from "react";
import useAxios from "axios-hooks";
import { makeStyles } from "@material-ui/core/styles";
import ErrorTemplate from "../../templates/Error";
import * as _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";

import mockRea from "../mocks/reas.json";
import mockPatient from "../mocks/patient.json";

const style = makeStyles((theme) => ({
  buttonProgress: {
    color: "#60E73C",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function withDataFromFetch(Component, { url, config = {} }) {
  const classes = style();

  return (props) => {
    console.log(`Getting data from url ${url}`);
    let [{ data, loading, error }, fetch] = useAxios(
      {
        ...config,
        url,
      },
      { manual: true }
    );

    useEffect(() => {
      process.env.REACT_APP_IS_DEV === "1" || fetch();
    }, [fetch]);

    let isDev = process.env.REACT_APP_IS_DEV;
    if (isDev === "1") {
      if (url.search("rea") >= 0) {
        data = mockRea;
      } else if (url.search("patient") >= 0) {
        data = mockPatient;
      }
    }

    const reFetch = () => {
      process.env.REACT_APP_IS_DEV === "1" ? data = _.cloneDeep(data) : fetch();
    }

    if (!data || loading)
      return <CircularProgress size={24} className={classes.buttonProgress} />;
    if (error) {
      console.log(error);
      return <ErrorTemplate />;
    }

    console.log(`Data received from ${url}:`);
    console.log(data);
    return <Component data={_.cloneDeep(data)} reFetch={reFetch} {...props} />;
  };
}

export default withDataFromFetch;
