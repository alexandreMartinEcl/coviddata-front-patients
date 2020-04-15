import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import config from "../config";
import * as _ from "lodash";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { getFormatDateFromFirst } from "../shared/utils/date";
import { Typography } from "@material-ui/core";
import { initSchema, cloneSchema, flat } from "../shared/utils/schema";
import Form from "../components/Form";
import addStatusMeasureFormSchema from "../json/schemaStatusMeasure.json";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.primary.veryLight,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function MeasuresTable({ patientId, data, setMeasuresId, reFetch, ...props }) {
  const classes = useStyles();
  const [openDialEdit, setOpenDialEdit] = React.useState(false);
  const [tableData, setTableData] = React.useState();
  const [formValues, setFormValues] = React.useState([]);
  const [savedValues, setSavedValues] = React.useState([]);
  const [selectedCol, setSelectedCol] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [formData, setFormData] = React.useState({});

  const schemaAddMeasure = cloneSchema(addStatusMeasureFormSchema).schema;

  // data.measures = measuresMoc;
  // data.hospitalisationEndDate = null;
  // data.hospitalisationDate = new Date().setDate(new Date().getDate() - 2);
  var firstMeasureDate;
  var lastMeasureDate;
  var columnTitles;
  var rowTitles;

  const buildColumnTitles = () => {
    lastMeasureDate = data.hospitalisationEndDate
      ? new Date(data.hospitalisationEndDate)
      : new Date();
    lastMeasureDate = new Date(
      lastMeasureDate.getFullYear(),
      lastMeasureDate.getMonth(),
      lastMeasureDate.getDate()
    ); // back to midnight

    firstMeasureDate = new Date(data.hospitalisationDate);
    firstMeasureDate = new Date(
      firstMeasureDate.getFullYear(),
      firstMeasureDate.getMonth(),
      firstMeasureDate.getDate()
    ); // back to midnight
    let nbDays = Math.round((lastMeasureDate - firstMeasureDate) / 86400000);

    let nbColumns = nbDays + 1;

    columnTitles = [...Array(nbColumns).keys()].map((i) => ({
      sum: `J${i + 1}`,
      full: getFormatDateFromFirst(firstMeasureDate, i),
    }));
  };

  const buildRowTitles = () => {
    rowTitles = configOrderRows.map(
      (r) => statusTypeInterface.find((t) => t.name === r.name).small
    );
  };

  const getColumnFromDate = (date) => {
    date = new Date(date);
    let day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.round((day - firstMeasureDate) / 86400000);
  };

  const getDateFromColumn = (col) => {
    let firstDate = new Date(firstMeasureDate);
    return new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate() + col,
      10 //TODO later, see how to do this better.. but without this, will return the previous day at 23:00
    );
  };

  //TODO make these "interfaces" better
  const statusTypeInterface = [
    { name: "Ratio pression artérielle sur fraction inspirée", small: "P/F" },
    { name: "Noradrénaline", small: "NAD (mg/h)" },
    { name: "Créatinémie", small: "Creat" },
    { name: "Decubitus ventral", small: "DV" },
    { name: "Mode ventilatoire", small: "Mode Vent." },
    { name: "Sédation", small: "Sédation" },
    { name: "Antibiotiques", small: "Antib." },
    { name: "Type de prélèvements", small: "Prélèvements" },
    { name: "Germes", small: "Germes" },
    { name: "Curares", small: "Curares" },
  ];

  // think of updating ../json/schemaStatusMeasure.json too
  const configOrderRows = [
    { name: "Mode ventilatoire", helper: "Décimal" },
    {
      name: "Ratio pression artérielle sur fraction inspirée",
      helper: "Décimal",
    },
    { name: "Decubitus ventral", helper: "Décimal" },
    { name: "Sédation", helper: "Décimal" },
    { name: "Curares", helper: "['VPC', 'VAC', 'VSAI', 'VS', 'opti', 'CPAP']" },
    { name: "Noradrénaline", helper: "Text" },
    { name: "Créatinémie", helper: "Text" },
    { name: "Antibiotiques", helper: "Text" },
    { name: "Type de prélèvements", helper: "Text" },
    { name: "Germes", helper: "Text" },
  ];

  const buildTableData = () => {
    let table = [...Array(configOrderRows.length).keys()].map((i) =>
      [...Array(columnTitles.length).keys()].map((j) => ``)
    );
    let orderNames = configOrderRows.map((r) => r.name);
    data.measures.forEach((m) => {
      let col = getColumnFromDate(m.created_date);
      let row = orderNames.findIndex(
        (i) => i === statusTypeInterface[m.status_type].name
      );
      table[row][col] = m.value;
    });
    setTableData(table);
  };

  const measureAddedInfo = (rowTitle, measureValue) => {
    switch (rowTitle) {
      case "NAD (mg/h)":
        if (Number(data.weight_kg) && Number(measureValue)) {
          return `(${
            Number(measureValue) / Number(data.weight_kg).toFixed(2)
          } mg/kg/h)`;
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const closeEditDial = () => {
    setOpenDialEdit(false);
  };

  const cancelEditDial = () => {
    setFormValues(savedValues.slice(0));
    closeEditDial();
  };

  const openEditDial = (col) => {
    let values = tableData.map((row) => row[col]);
    // change values only if we select another col than precedently
    if (col !== selectedCol) {
      // setFormValues(values.slice(0));

      let statusTypes = statusTypeInterface.map((t) => t.name);
      let temData = {};
      values.forEach((v, i) => {
        let statusType = configOrderRows[i].name;
        let dbStatusType = statusTypes.findIndex((i) => i === statusType);
        temData[dbStatusType] = isNaN(Number(v)) ? v : Number(v);
      });
      setFormData(_.cloneDeep(temData));
      setSelectedCol(col);
    }

    setOpenDialEdit(true);
  };

  const onTextFieldChange = (value, id) => {
    let tempValues = formValues.slice(0);
    tempValues[id] = value;
    setFormValues(tempValues);
  };

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
  };

  const cleanFormData = (fData) => {
    let temData = _.cloneDeep(fData);
    Object.entries(temData).forEach(([k, v]) => {
      if (!v) {
        delete temData[k];
      }
    });
    return temData;
  };

  const onSubmitEdit = (initialData, setLoadingCb) => {
    setLoadingCb(true);

    const data = flat(initialData);

    const jsonData = [];
    let tDate = getDateFromColumn(selectedCol).toJSON().split("T")[0];
    Object.entries(data).forEach(([k, v]) => {
      jsonData.push({
        created_date: tDate,
        id_patient: patientId,
        status_type: k,
        value: typeof v === "string" ? v.trim() : v,
      });
    });
    const url = config.path.measures;

    console.log("Sending to " + url);
    console.log(jsonData);
    axios({
      method: "post",
      url,
      data: jsonData,
      ...config.axios,
      headers: {
        "Content-Type": "Application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        console.log(res);
        setLoadingCb(false);
        setOpenDialEdit(false);
        reFetch();
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.toString());
        setSnackbarOpen(true);
        setLoadingCb(false);
      });
  };

  columnTitles || buildColumnTitles();
  tableData || buildTableData();
  rowTitles || buildRowTitles();
  rowTitles || buildRowTitles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            {columnTitles.map((c, i) => (
              <StyledTableCell align="center" onClick={() => openEditDial(i)}>
                <Typography>{c.sum}</Typography>
                <br />
                <Typography>{c.full}</Typography>
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!tableData ||
            tableData.map((row, i) => (
              <StyledTableRow key={statusTypeInterface[i].small}>
                <StyledTableCell component="th" scope="row">
                  {rowTitles[i]}
                </StyledTableCell>

                {row.map((cell, j) => (
                  <StyledTableCell
                    align="center"
                    onClick={() => openEditDial(j)}
                  >
                    {cell} {measureAddedInfo(rowTitles[i], cell)}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog
        open={openDialEdit}
        onClose={closeEditDial}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Modification de la colonne J{selectedCol + 1}
        </DialogTitle>
        <DialogContent>
          <Form
            schema={schemaAddMeasure}
            formData={cleanFormData(formData)}
            onSubmit={(form, setLoadingCb) =>
              onSubmitEdit(form.formData, setLoadingCb)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEditDial} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackBar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={closeSnackBar}
          severity="error"
        >
          La requête a échoué {errMsg}
        </MuiAlert>
      </Snackbar>
    </TableContainer>
  );
}

export default MeasuresTable;
