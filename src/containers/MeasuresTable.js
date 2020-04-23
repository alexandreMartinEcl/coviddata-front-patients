import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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

import { getFormatDateFromFirst, setToMidnight } from "../shared/utils/date";
import {
  Typography,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import statusMeasuresInterface from "../json/statusMeasures.json";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { manageError } from "../shared/utils/tools";

import {
  HeartFailureIcon,
  BioChemicalFailureIcon,
  BrainFailureIcon,
  LungFailureIcon,
  KidneyFailureIcon,
  LiverFailureIcon,
  HematologicFailureIcon,
} from "../shared/icons/index";

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

const configOrderRows = [
  // {
  //   title: "Poumons",
  //   rows: [
  statusMeasuresInterface.vent,
  statusMeasuresInterface.p_f,
  statusMeasuresInterface.seda,
  statusMeasuresInterface.curar,
  //   ],
  // },
  // {
  //   title: "Reins",
  //   rows: [
  statusMeasuresInterface.creat,
  statusMeasuresInterface.eer,
  //       ],
  // },
  // {
  //   title: "Coeur",
  //   rows: [
  statusMeasuresInterface.nad,
  statusMeasuresInterface.adren,
  statusMeasuresInterface.dobut,
  //           ],
  // },
  // {
  //   title: "Métabolique",
  //   rows: [
  statusMeasuresInterface.lactat,
  //           ],
  // },
  // {
  //   title: "Cerveau",
  //   rows: [
  statusMeasuresInterface.glasgow,
  //   ],
  // },
  // {
  //   title: "Foie",
  //   rows: [
  statusMeasuresInterface.t_p,
  //   ],
  // },
  // {
  //   title: "Bactériologie",
  //   rows: [
  statusMeasuresInterface.antib,
  statusMeasuresInterface.prelev,
  statusMeasuresInterface.germes,
  //   ],
  // },
  // {
  //   title: "Hématologique",
  //   rows: [
  statusMeasuresInterface.plaqu,
  //   ],
  // },
  // statusMeasuresInterface.dv,
];

const rowIcons = {
  heart: (
    <HeartFailureIcon
      color="secondary"
      style={{ width: "20px", height: "20px" }}
    />
  ),
  metabolic: (
    <BioChemicalFailureIcon style={{ width: "20px", height: "20px" }} />
  ),
  brain: <BrainFailureIcon style={{ width: "20px", height: "20px" }} />,
  lung: <LungFailureIcon style={{ width: "20px", height: "20px" }} />,
  kidney: <KidneyFailureIcon style={{ width: "20px", height: "20px" }} />,
  liver: <LiverFailureIcon style={{ width: "20px", height: "20px" }} />,
  hematologic: (
    <HematologicFailureIcon style={{ width: "20px", height: "20px" }} />
  ),
};

const EditableCell = ({ statusType, ...props }) => {
  return statusType.enum ? (
    <Select margin="dense" {...props}>
      {statusType.enum.map((v, i) => (
        <MenuItem value={v}>{statusType.enumNames[i]}</MenuItem>
      ))}
    </Select>
  ) : (
    <TextField type={statusType.valueType} {...props} />
  );
};

function MeasuresTable({
  patientId,
  data,
  setMeasuresId,
  reFetch,
  onMeasureSubmit,
  forcedTableData,
  updateParentTableData,
  readOnly,
  ...props
}) {
  const classes = useStyles();
  const [tableData, setTableData] = React.useState(forcedTableData);
  const [savedTableData, setSavedTableData] = React.useState([]);
  const [selectedCol, setSelectedCol] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(false);
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

  const closeSnackBar = (event, reason) => {
    setSnackbarOpen(false);
    setInfoMsg("");
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case "Enter":
        submitEdit();
        break;
      case "Escape":
        cancelEdit();
        break;
      default:
        return;
    }
  };

  var firstMeasureDate;
  var lastMeasureDate;
  var columnTitles;
  var rowTitles;

  const buildColumnTitles = () => {
    lastMeasureDate = data.hospitalisationEndDate
      ? new Date(data.hospitalisationEndDate)
      : new Date();
    lastMeasureDate = setToMidnight(lastMeasureDate);

    firstMeasureDate = new Date(data.hospitalisationDate);
    firstMeasureDate = setToMidnight(firstMeasureDate);

    let nbDays = Math.round((lastMeasureDate - firstMeasureDate) / 86400000);

    let nbColumns = nbDays + 1;

    columnTitles = [...Array(nbColumns).keys()].map((i) => ({
      sum: `J${i + 1}`,
      full: getFormatDateFromFirst(firstMeasureDate, i),
    }));
  };

  const buildRowTitles = () => {
    rowTitles = configOrderRows.map(
      (status) =>
        // <Grid container alignItems="center" justify="flex-start">
        //   <Grid item xs>
        //     {status.group ? rowIcons[status.group] : (<></>)}
        //   </Grid>
        //   <Grid item xs>
        `${status.small} ${status.unit ? `(${status.unit})` : ""}`
      //   </Grid>
      // </Grid>
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

  const buildTableData = () => {
    // create empty table
    let table = [...Array(configOrderRows.length).keys()].map((i) =>
      [...Array(columnTitles.length).keys()].map((j) => ``)
    );

    data.measures.forEach((m) => {
      let col = getColumnFromDate(m.created_date);
      let type = Object.values(statusMeasuresInterface).find(
        (status) => status.dbValue === Number(m.status_type)
      );
      let row = configOrderRows.findIndex((i) => i === type);
      if (row !== -1) table[row][col] = m.value;
    });
    setTableData(_.cloneDeep(table));
    setSavedTableData(_.cloneDeep(table));
  };

  const measureAddedInfo = (configOrderRow, measureValue) => {
    switch (configOrderRow) {
      case statusMeasuresInterface.nad: // mg/h -> mg/kg/h
        if (Number(data.weight_kg) && Number(measureValue)) {
          return `(${
            Number(measureValue) / Number(data.weight_kg).toFixed(2)
          } mg/kg/h)`;
        } else {
          return "";
        }
      case statusMeasuresInterface.dobut: // μg/min -> μg/kg/min
        if (Number(data.weight_kg) && Number(measureValue)) {
          return `(${(Number(measureValue) / Number(data.weight_kg)).toFixed(
            2
          )} μg/kg/min)`;
        } else {
          return "";
        }
      case statusMeasuresInterface.adren: // mg/h -> μg/kg/min
        if (Number(data.weight_kg) && Number(measureValue)) {
          return `(${(
            Number(measureValue) /
            Number(data.weight_kg) /
            1000 /
            60
          ).toFixed(2)} μg/kg/min)`;
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const makeColumnEditable = (row, col) => {
    if (!readOnly) {
      // let values = tableData.map((row) => row[col]);
      // change values only if we select another col than precedently
      if (col !== selectedCol) {
        setTableData(_.cloneDeep(savedTableData));
        setSelectedRow(row);
        setSelectedCol(col);
      }
    }
  };

  const cancelEdit = () => {
    setSelectedCol(null);
    setTableData(_.cloneDeep(savedTableData));
  };

  const onEditableCellChange = (row, col, valueType) => {
    return (event) => {
      if (valueType === "number" && event.target.value === "") {
        return;
      }
      let temData = _.cloneDeep(tableData);
      temData[row][col] = event.target.value;
      setTableData(_.cloneDeepWith(temData));
    };
  };

  const updateTableData = (formData) => {
    let temTableData = _.cloneDeep(tableData);
    Object.entries(formData).forEach((e) => {
      let [statusDbValue, value] = e;
      let status = Object.values(statusMeasuresInterface).find(
        (s) => s.dbValue.toString() === statusDbValue
      );
      if (status) {
        let rwIndex = configOrderRows.findIndex((r) => r.id === status.id);
        temTableData[rwIndex][selectedCol] = value;
      }
    });

    setTableData(_.cloneDeep(temTableData));
    setSavedTableData(_.cloneDeep(temTableData));
    updateParentTableData && updateParentTableData(temTableData);
  };

  const submitEdit = () => {
    setLoadingUpdate(true);

    let tDate = getDateFromColumn(selectedCol).toJSON().split("T")[0];

    let values = tableData.map((row) => row[selectedCol]);
    let savedValues = savedTableData.map((row) => row[selectedCol]);

    // const savedData = {}; // describe the former data of the column, for FailureChange callback
    const newData = {}; // describe the former data of the column, for FailureChange callback
    const jsonData = []; // describe the data to send to backend (only changed value, with right format)
    values.forEach((v, i) => {
      let statusType = configOrderRows[i];
      let dbStatusType = statusType.dbValue;
      // let savedValue = savedValues[i];
      // savedValue = statusType.valueType === "number" ? Number(savedValue) : (statusType.valueType === "string" ? savedValue.trim() : savedValue);

      // savedData[configOrderRows[i].dbValue] = savedValue;
      v = statusType.valueType === "string" ? v.trim() : v;
      newData[configOrderRows[i].dbValue] = v;
      if (v === savedValues[i]) return;
      let value = statusType.valueType === "number" ? Number(v) : v;

      jsonData.push({
        created_date: tDate,
        id_patient: patientId,
        status_type: dbStatusType,
        value: value,
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
        setLoadingUpdate(false);
        updateTableData(data);
        onMeasureSubmit(newData, tDate);
        setSelectedCol(null);
      })
      .catch((err) => {
        setLoadingUpdate(false);
        manageError(err.response, uiInform);
      });
  };

  columnTitles || buildColumnTitles();
  tableData || buildTableData();
  rowTitles || buildRowTitles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            {columnTitles.map((c, j) => (
              <StyledTableCell key={`${c.sum}`} align="center">
                <Typography>{c.sum}</Typography>
                <br />
                <Typography>{c.full}</Typography>
                {selectedCol === j ? (
                  <React.Fragment>
                    <br />
                    <IconButton
                      aria-label="save"
                      color="primary"
                      onClick={cancelEdit}
                    >
                      <CancelIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      aria-label="save"
                      color="primary"
                      onClick={submitEdit}
                    >
                      <SaveIcon fontSize="large" />
                    </IconButton>
                    {loadingUpdate && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <></>
                )}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!tableData ||
            tableData
              .filter((row) => !readOnly || row.find((c) => c)) // display only not empty rows when readOnly
              .map((row, i) => (
                <StyledTableRow key={`${rowTitles[i]}`}>
                  <StyledTableCell>{rowTitles[i]}</StyledTableCell>

                  {row.map((cell, j) => (
                    <Tooltip
                      key={`${rowTitles[i]}-${j}`}
                      title={configOrderRows[i].fullName}
                      arrow
                    >
                      <StyledTableCell
                        align="center"
                        onDoubleClick={() => makeColumnEditable(i, j)}
                        key={`${rowTitles[i]}-${j}`}
                      >
                        {selectedCol === j ? (
                          <EditableCell
                            statusType={configOrderRows[i]}
                            autoFocus={i === selectedRow}
                            value={`${cell}`}
                            onChange={onEditableCellChange(
                              i,
                              j,
                              configOrderRows[i].valueType
                            )}
                            onKeyDown={handleKeyPress}
                          />
                        ) : (
                          `${cell} ${measureAddedInfo(
                            configOrderRows[i],
                            cell
                          )}`
                        )}
                      </StyledTableCell>
                    </Tooltip>
                  ))}
                </StyledTableRow>
              ))}
        </TableBody>
      </Table>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackBar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={closeSnackBar}
          severity={snackbarSeverity}
        >
          {infoMsg}
        </MuiAlert>
      </Snackbar>
    </TableContainer>
  );
}

export default MeasuresTable;
