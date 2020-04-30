import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../config";
import * as _ from "lodash";
import { evaluate as mathEval } from "mathjs";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { getFormatDateFromFirst, nbDaysBetween } from "../shared/utils/date";
import {
  Typography,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Box,
  Slider,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import statusMeasuresInterface from "../json/statusMeasures.json";

import { manageError } from "../shared/utils/tools";

import {
  HeartFailureIcon,
  BioChemicalFailureIcon,
  BrainFailureIcon,
  LungFailureIcon,
  KidneyFailureIcon,
  LiverFailureIcon,
  HematologicFailureIcon,
  InfectiousIcon,
} from "../shared/icons/index";

const useStyles = makeStyles((theme) => ({
  globalTableContainer: {
    maxHeight: 1000,
    borderRadius: "10px",
  },
  tableHead: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    minWidth: "150px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 9,
      minWidth: "10px",
    },
  },
  firstCol: {
    minWidth: "50px",
    width: "80px",
    maxWidth: "80px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "25px",
      width: "25px",
      maxWidth: "50px",
    },
  },
  tableCell: {
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      fontSize: 8,
    },
  },
  tableTitleCell: {
    fontWeight: "bold",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.primary.veryLight,
    },
  },
  rowIcon: {
    width: "50px",
    height: "50px",
    [theme.breakpoints.down("sm")]: {
      width: "25px",
      height: "25px",
    },
  },
}));

/**
 * Keys MUST match with statusMeasures' .group (if not, it won't be correctly checked for failures)
 * TODO should be better (given information is dupplciated)
 */
const configOrderRows = {
  lung: {
    title: "Poumons",
    rows: [
      statusMeasuresInterface.vent,
      statusMeasuresInterface.p_f,
      statusMeasuresInterface.o_2,
      statusMeasuresInterface.pa_o2,
      statusMeasuresInterface.fio2,
      statusMeasuresInterface.curar,
      statusMeasuresInterface.dv,
    ],
    id: "lung",
  },
  kidney: {
    title: "Reins",
    rows: [statusMeasuresInterface.creat, statusMeasuresInterface.eer],
    id: "kidney",
  },
  heart: {
    title: "Coeur",
    rows: [
      statusMeasuresInterface.nad,
      statusMeasuresInterface.adren,
      statusMeasuresInterface.dobut,
    ],
    id: "heart",
  },
  metabolic: {
    title: "Métabolique",
    rows: [statusMeasuresInterface.lactat],
    id: "metabolic",
  },
  brain: {
    title: "Cerveau",
    rows: [statusMeasuresInterface.glasgow, statusMeasuresInterface.seda],
    id: "brain",
  },
  liver: {
    title: "Foie",
    rows: [statusMeasuresInterface.t_p],
    id: "liver",
  },
  hematologic: {
    title: "Hématologique",
    rows: [statusMeasuresInterface.plaqu],
    id: "hematologic",
  },
  infectious: {
    title: "Infectieux",
    rows: [
      statusMeasuresInterface.antib,
      statusMeasuresInterface.prelev,
      statusMeasuresInterface.germes,
    ],
    id: "infectious",
  },
  // statusMeasuresInterface.dv,
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
  parentUiInform,
  ...props
}) {
  const classes = useStyles();
  const [tableData, setTableData] = React.useState(forcedTableData);
  const [savedTableData, setSavedTableData] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [selectedCol, setSelectedCol] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const defaultNbDaysToDisplay = readOnly
    ? localStorage.getItem("nbDaysToDisplayGarde")
    : localStorage.getItem("nbDaysToDisplay");
  const [nbDaysToDisplay, setNbDaysToDisplay] = React.useState(
    defaultNbDaysToDisplay
  );

  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
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

  const rowIcons = {
    heart: <HeartFailureIcon className={classes.rowIcon} />,
    metabolic: <BioChemicalFailureIcon className={classes.rowIcon} />,
    brain: <BrainFailureIcon className={classes.rowIcon} />,
    lung: <LungFailureIcon className={classes.rowIcon} />,
    kidney: <KidneyFailureIcon className={classes.rowIcon} />,
    liver: <LiverFailureIcon className={classes.rowIcon} />,
    hematologic: <HematologicFailureIcon className={classes.rowIcon} />,
    infectious: <InfectiousIcon className={classes.rowIcon} />,
  };

  var firstMeasureDate;
  var lastMeasureDate;
  var columnTitles;
  let rowTitles;

  const buildColumnTitles = () => {
    lastMeasureDate = data.hospitalisationEndDate
      ? new Date(data.hospitalisationEndDate)
      : new Date();

    firstMeasureDate = new Date(data.hospitalisationDate);

    let nbDays = nbDaysBetween(firstMeasureDate, lastMeasureDate);

    let nbColumns = nbDays + 1;

    columnTitles = [...Array(nbColumns).keys()].map((i) => ({
      sum: `J${i + 1}`,
      full: getFormatDateFromFirst(firstMeasureDate, i),
    }));
  };

  const buildRowTitles = () => {
    rowTitles = {};
    Object.entries(configOrderRows).forEach(([group, { rows }]) => {
      rowTitles[group] = rows.map(
        (status) => `${status.small} ${status.unit ? `(${status.unit})` : ""}`
      );
    });
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

  const completeReadOnlyRows = (data) => {
    Object.entries(configOrderRows).forEach(([group, groupConfig]) => {
      let dataMatch = (col) => {
        let res = {};
        groupConfig.rows.forEach((status, i) => {
          res[`${status.id}`] = data[group][i][col];
        });
        return res;
      };
      groupConfig.rows.forEach((status, i) => {
        if (status.readOnly) {
          data[group][i] = data[group][i].map((v, j) => {
            let res = mathEval(status.formula, dataMatch(j));
            return res.toString() === "Infinity" || isNaN(res) ? "" : res;
          });
        }
      });
    });
  };

  const buildTableData = () => {
    // create empty table
    let table = {};
    Object.entries(configOrderRows).forEach(([group, groupConfig]) => {
      table[group] = [...Array(groupConfig.rows.length).keys()].map((i) =>
        [...Array(columnTitles.length).keys()].map((j) => ``)
      );
    });

    data.measures.forEach((m) => {
      let col = getColumnFromDate(m.created_date);
      let type = Object.values(statusMeasuresInterface).find(
        (status) => status.dbValue === Number(m.status_type)
      );
      let group = type.group;
      if (!group) return;
      let row = configOrderRows[group].rows.findIndex((i) => i === type);
      if (row === -1) return;
      table[group][row][col] = m.value;
    });

    completeReadOnlyRows(table);

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

  const makeColumnEditable = (group, row, col) => {
    if (!readOnly) {
      // let values = tableData.map((row) => row[col]);
      // change values only if we select another col than precedently
      if (col !== selectedCol) {
        setTableData(_.cloneDeep(savedTableData));
        setSelectedGroup(group);
        setSelectedRow(row);
        setSelectedCol(col);
      }
    }
  };

  const cancelEdit = () => {
    setSelectedCol(null);
    setSelectedGroup(null);
    setTableData(_.cloneDeep(savedTableData));
  };

  const onEditableCellChange = (group, row, col, valueType) => {
    return (event) => {
      if (valueType === "number" && event.target.value === "") {
        return;
      }
      let temData = _.cloneDeep(tableData);
      temData[group][row][col] = event.target.value;
      setTableData(_.cloneDeepWith(temData));
    };
  };

  const updateTableData = (updatedData) => {
    let temTableData = _.cloneDeep(tableData);
    updatedData.forEach((statusMeasure) => {
      const { created_date, value, status_type } = statusMeasure;

      let col = getColumnFromDate(created_date);
      let row;
      let group = Object.keys(configOrderRows).find((k) => {
        row = configOrderRows[k].rows.findIndex(
          (statusConfig) => statusConfig.dbValue === Number(status_type)
        );
        return row !== -1;
      });

      temTableData[group][row][col] = value;
    });

    completeReadOnlyRows(temTableData);

    setTableData(_.cloneDeep(temTableData));
    setSavedTableData(_.cloneDeep(temTableData));
    updateParentTableData && updateParentTableData(temTableData);
  };

  const submitEdit = () => {
    setLoadingUpdate(true);

    let tDate = getDateFromColumn(selectedCol).toJSON().split("T")[0];

    let values = tableData[selectedGroup].map((row) => row[selectedCol]);
    let savedValues = savedTableData[selectedGroup].map(
      (row) => row[selectedCol]
    );

    const newData = {}; // describe the former data of the column, for FailureChange callback
    const jsonData = []; // describe the data to send to backend (only changed value, with right format)
    values.forEach((v, i) => {
      let statusType = configOrderRows[selectedGroup].rows[i];
      if (statusType.readOnly) return;

      let dbStatusType = statusType.dbValue;
      v = statusType.valueType === "string" ? v.trim() : v;
      newData[configOrderRows[selectedGroup].rows[i].id] = v;
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

    setLoadingUpdate(false);
    onMeasureSubmit(newData, tDate, selectedGroup);
    setSelectedCol(null);
    //
    // axios({
    // method: "post",
    // url,
    // data: jsonData,
    // ...config.axios,
    // headers: {
    // "Content-Type": "Application/json",
    // "Access-Control-Allow-Origin": "*",
    // },
    // })
    // .then((res) => {
    // console.log(res);
    // setLoadingUpdate(false);
    // updateTableData(res.data);
    // TODO technically, its better to put res.data in onMeasureSubmit
    // onMeasureSubmit(newData, tDate, selectedGroup);
    // setSelectedCol(null);
    // })
    // .catch((err) => {
    // console.log(err);
    // setLoadingUpdate(false);
    // manageError(err.response, parentUiInform);
    // });
  };

  const getActualNbDaysToDisplay = () => {
    return Math.min(
      nbDaysToDisplay ? nbDaysToDisplay : columnTitles.length,
      columnTitles.length
    );
  };

  columnTitles || buildColumnTitles();
  tableData || buildTableData();
  rowTitles || buildRowTitles();
  return (
    <Box
      style={{
        padding: "5px",
        margin: "15px",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
    >
      <Typography>Nombre de jours à afficher</Typography>
      <Slider
        defaultValue={getActualNbDaysToDisplay()}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={2}
        max={columnTitles.length}
        onChange={(e, val) => {
          localStorage.setItem(
            readOnly ? "nbDaysToDisplayGarde" : "nbDaysToDisplay",
            val
          );
          setNbDaysToDisplay(val);
        }}
      />
      <TableContainer className={classes.globalTableContainer}>
        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell
                className={`${classes.tableHead} ${classes.firstCol}`}
              ></TableCell>
              <TableCell className={`${classes.tableHead}`}>Type</TableCell>
              {columnTitles.slice(-getActualNbDaysToDisplay()).map((c, j) => {
                let actualDataCol =
                  columnTitles.length - getActualNbDaysToDisplay() + j;

                return (
                  <TableCell
                    className={`${classes.tableHead} ${classes.tableTitleCell}`}
                    key={`${c.sum}`}
                    align="center"
                  >
                    {c.sum}
                    <br />
                    {c.full}
                    {selectedCol === actualDataCol ? (
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
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {!tableData ||
              Object.entries(tableData).map(([group, rows]) => {
                // display only not empty rows when readOnly
                let filteredRws = rows.filter(
                  (row) => !readOnly || row.find((c) => c)
                );
                return (
                  <React.Fragment>
                    {filteredRws.length === 0 || (
                      <TableCell
                        className={`${classes.tableCell} ${classes.firstCol}`}
                        rowSpan={filteredRws.length + 1}
                      >
                        {rowIcons[group]}
                      </TableCell>
                    )}
                    {filteredRws.map((row, i) => (
                      <TableRow
                        className={classes.tableRow}
                        key={`${rowTitles[group][i]}`}
                      >
                        <TableCell
                          className={`${classes.tableCell} ${classes.tableTitleCell}`}
                        >
                          {rowTitles[group][i]}
                        </TableCell>
                        {row
                          .slice(-getActualNbDaysToDisplay())
                          .map((cell, j) => {
                            let actualDataCol =
                              row.length - getActualNbDaysToDisplay() + j;
                            return (
                              <Tooltip
                                key={`${rowTitles[group][i]}-${j}`}
                                title={configOrderRows[group].rows[i].fullName}
                                arrow
                              >
                                <TableCell
                                  className={classes.tableCell}
                                  align="center"
                                  onDoubleClick={() =>
                                    makeColumnEditable(group, i, actualDataCol)
                                  }
                                >
                                  {selectedCol === actualDataCol &&
                                  group === selectedGroup &&
                                  !configOrderRows[group].rows[i].readOnly ? (
                                    <EditableCell
                                      statusType={
                                        configOrderRows[group].rows[i]
                                      }
                                      autoFocus={i === selectedRow}
                                      value={`${cell}`}
                                      onChange={onEditableCellChange(
                                        group,
                                        i,
                                        actualDataCol,
                                        configOrderRows[group].rows[i].valueType
                                      )}
                                      onKeyDown={handleKeyPress}
                                    />
                                  ) : (
                                    `${cell} ${measureAddedInfo(
                                      configOrderRows[group].rows[i],
                                      cell
                                    )}`
                                  )}
                                </TableCell>
                              </Tooltip>
                            );
                          })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
          </TableBody>
        </Table>

        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow></TableRow>
          </TableHead>

          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MeasuresTable;
