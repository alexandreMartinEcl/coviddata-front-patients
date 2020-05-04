import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import Routes from "./components/Routes";
import "./design.scss";
import theme from "./theme";

import rootReducer from './store/reducers'
import { createStore } from "redux";
import { Provider } from "react-redux";
import SnackBar from "./components/SnackBar";

const store = createStore(rootReducer)

function Loading({ children }) {
  // // const {
  // //     data: [patient, ventilation],
  // //     loading,
  // //     error
  // // } = useMultipleAxios(config.schema_list, config.axios);

  // if (loading) return <></>;
  // if (error) return <ErrorTemplate />;

  // global.schema = { patient, ventilation };
  // global.properties = {
  //     patient: collectProperties(patient),
  //     ventilation: collectProperties(ventilation)
  // };

  return children;
}

function Init(props) {
  // const theme = createMuiTheme({}, frFR);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: theme.palette.background.default }}>
          <Routes />
          <SnackBar/>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

ReactDOM.render(
  <Loading>
    <Init />
  </Loading>,
  document.getElementById("root")
);
