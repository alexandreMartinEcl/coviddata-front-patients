import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MTableToolbar from "../custom/MTableToolbar";
import moment from "moment";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
        <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
        <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function SortingTable({ tile = "Table", options = {}, ...props }) {
    return (
        <MaterialTable
            {...props}
            icons={tableIcons}
            options={{
                sorting: true,
                filtering: true,
                pageSize: 5,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showEmptyDataSourceMessage: false,
                draggable: false,
                columnsButton: true,
                exportButton: true,
                exportFileName: `${props.title.toLowerCase()}_${moment().format(
                    "DD-MM-YYYY"
                )}`,
                ...options
            }}
            components={{
                Toolbar: props => <MTableToolbar {...props} />
            }}
            localization={{
                pagination: {
                    labelDisplayedRows: "{from}-{to} sur {count}",
                    labelRowsSelect: "lignes",
                    labelRowsPerPage: "Lignes par page",
                    firstAriaLabel: "Première page",
                    firstTooltip: "Première page",
                    previousAriaLabel: "Page précedente",
                    previousTooltip: "Page précedente",
                    nextAriaLabel: "Page suivante",
                    nextTooltip: "Page suivante",
                    lastAriaLabel: "Dernière page",
                    lastTooltip: "Dernière page"
                },
                body: {
                    emptyDataSourceMessage: "Aucune entrée",
                    filterRow: {
                        filterTooltip: "Filtrer"
                    }
                },
                toolbar: {
                    searchTooltip: "Rechercher",
                    searchPlaceholder: "Rechercher",
                    addRemoveColumns: "Ajouter ou supprimer une colonne",
                    exportTitle: "Exporter",
                    exportAriaLabel: "Exporter",
                    exportName: "Exporter au format CSV"
                }
            }}
        />
    );
}

export default SortingTable;
