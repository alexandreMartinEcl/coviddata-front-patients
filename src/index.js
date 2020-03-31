import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { frFR } from "@material-ui/core/locale";
import Routes from "./components/Routes";
import ErrorTemplate from "./templates/Error";
import useMultipleAxios from "./shared/hooks/useMultipleAxios";
import { collectProperties } from "./shared/utils/table";
import config, { global } from "./config";
import "./design.scss";

function Loading({ children }) {
    const {
        data: [patient, ventilation],
        loading,
        error
    } = useMultipleAxios(config.schema_list, config.axios);

    if (loading) return <></>;
    if (error) return <ErrorTemplate />;

    global.schema = { patient, ventilation };
    global.properties = {
        patient: collectProperties(patient),
        ventilation: collectProperties(ventilation)
    };

    return children;
}

function Init(props) {
    const theme = createMuiTheme({}, frFR);

    return (
        <ThemeProvider theme={theme}>
            <Routes />
        </ThemeProvider>
    );
}

ReactDOM.render(
    <Loading>
        <Init />
    </Loading>,
    document.getElementById("root")
);
