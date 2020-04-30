import React from "react";
import * as _ from "lodash";
import { evaluate as mathEval } from "mathjs";

import { MeasuresTable, EditableText, CheckList } from "./Components";

import {
  HeartFailureIcon,
  BioChemicalFailureIcon,
  BrainFailureIcon,
  LungFailureIcon,
  KidneyFailureIcon,
  LiverFailureIcon,
  HematologicFailureIcon,
} from "../shared/icons/index";

import statusMeasuresInterface from "../json/statusMeasures.json";
import { isSameDay } from "../shared/utils/date";
import {
  Typography,
  Grid,
  DialogTitle,
  DialogContent,
  Dialog,
  Box,
  makeStyles,
} from "@material-ui/core";

import {
  submitFailureChecklist,
  submitEditableText,
} from "../repository/patient.repository";
import { manageError } from "../shared/utils/tools";

const useStyles = makeStyles((theme) => ({
  label: {
    backgroundColor: "white",
    textAlign: "center",
    margin: "5px",
    borderRadius: "10px",
  },
  title: {
    backgroundColor: theme.palette.primary.light,
    textColor: "white",
    textAlign: "center",
    borderRadius: "5px",
    verticalAlign: "middle",
    height: "40px",
  },
}));

const failureProposerCriteria = {
  heart_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.nad,
        relation: "gte",
        value: 0.5,
        ifNull: false,
      },
    ],
    [
      {
        statusMeasureType: statusMeasuresInterface.dobut,
        relation: "gt",
        value: 0,
        ifNull: false,
      },
    ],
    [
      {
        statusMeasureType: statusMeasuresInterface.adren,
        relation: "gt",
        value: 0,
        ifNull: false,
      },
    ],
  ],
  bio_chemical_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.lactat,
        relation: "gte",
        value: 2,
        ifNull: false,
      },
    ],
  ],
  brain_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.glasgow,
        relation: "lte",
        value: 14,
        ifNull: false,
      },
      {
        statusMeasureType: statusMeasuresInterface.seda,
        relation: "equ",
        value: "",
        ifNull: true,
      },
    ],
  ],
  lung_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.vent,
        relation: "ne",
        value: "VS",
        ifNull: false,
      },
    ],
    [
      {
        statusMeasureType: statusMeasuresInterface.p_f,
        relation: "lt",
        value: 300,
        ifNull: false,
      },
    ],
  ],
  kidney_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.eer,
        relation: "ne",
        value: "",
        ifNull: false,
      },
    ],
    [
      {
        statusMeasureType: statusMeasuresInterface.creat,
        relation: "gte",
        value: 150,
        ifNull: false,
      },
    ],
  ],
  liver_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.t_p,
        relation: "lte",
        value: 0.6,
        ifNull: false,
      },
    ],
  ],
  hematologic_failure: [
    [
      {
        statusMeasureType: statusMeasuresInterface.plaqu,
        relation: "lte",
        value: 150000,
        ifNull: false,
      },
    ],
  ],
};

const describeCriterium = (criterium, between) => {
  if (Array.isArray(criterium)) {
    return criterium.map((c) => describeCriterium(c, " ET ")).join(between);
  }
  switch (criterium.relation) {
    case "equ":
      return `${criterium.statusMeasureType.small} = ${
        criterium.value === "" ? "''" : criterium.value
        }`;
    case "ne":
      return `${criterium.statusMeasureType.small} != ${
        criterium.value === "" ? "''" : criterium.value
        }`;
    case "gt":
      return `${criterium.statusMeasureType.small} > ${
        criterium.value === "" ? "''" : criterium.value
        }`;
    case "lt":
      return `${criterium.statusMeasureType.small} < ${
        criterium.value === "" ? "''" : criterium.value
        }`;
    case "gte":
      return `${criterium.statusMeasureType.small} ≥ ${
        criterium.value === "" ? "''" : criterium.value
        }`;
    case "lte":
      return `${criterium.statusMeasureType.small} ≤ ${
        criterium.value === "" ? "''" : criterium.value
        }`;
    default:
      return;
  }
};

const failuresInterface = {
  heart_failure: `Défaillance cardiaque\n(${describeCriterium(
    failureProposerCriteria.heart_failure,
    " OU "
  )})`,
  bio_chemical_failure: `Défaillance métabolique\n(${describeCriterium(
    failureProposerCriteria.bio_chemical_failure,
    " OU "
  )})`,
  brain_failure: `Défaillance neurologique\n(${describeCriterium(
    failureProposerCriteria.brain_failure,
    " OU "
  )})`,
  lung_failure: `Défaillance pulmonaire\n(${describeCriterium(
    failureProposerCriteria.lung_failure,
    " OU "
  )})`,
  kidney_failure: `Défaillance rénale\n(${describeCriterium(
    failureProposerCriteria.kidney_failure,
    " OU "
  )})`,
  liver_failure: `Défaillance hépatique\n(${describeCriterium(
    failureProposerCriteria.liver_failure,
    " OU "
  )})`,
  hematologic_failure: `Défaillance hématologique\n(${describeCriterium(
    failureProposerCriteria.hematologic_failure,
    " OU "
  )})`,
};

const failuresIcons = {
  heart_failure: (
    <HeartFailureIcon style={{ width: "50px", height: "50px" }} />
  ),
  bio_chemical_failure: (
    <BioChemicalFailureIcon style={{ width: "50px", height: "50px" }} />
  ),
  brain_failure: (
    <BrainFailureIcon style={{ width: "50px", height: "50px" }} />
  ),
  lung_failure: <LungFailureIcon style={{ width: "50px", height: "50px" }} />,
  kidney_failure: (
    <KidneyFailureIcon style={{ width: "50px", height: "50px" }} />
  ),
  liver_failure: (
    <LiverFailureIcon style={{ width: "50px", height: "50px" }} />
  ),
  hematologic_failure: (
    <HematologicFailureIcon style={{ width: "50px", height: "50px" }} />
  ),
};

// TODO quick fix, should be refactored later with suggestFailureChange
// because group can be found in criterium.statusMeasureType.group
const interfaceGroupFailureCriteria = {
  lung: { failure: "lung_failure", name: "Défaillance pulmonaire" },
  kidney: { failure: "kidney_failure", name: "Défaillance rénale" },
  heart: { failure: "heart_failure", name: "Défaillance cardiaque" },
  metabolic: {
    failure: "bio_chemical_failure",
    name: "Défaillance métabolique",
  },
  brain: { failure: "brain_failure", name: "Défaillance cérébrale" },
  liver: { failure: "liver_failure", name: "Défaillance hépatique" },
  hematologic: {
    failure: "hematologic_failure",
    name: "Défaillance hématologique",
  },
};

const compare = (relation, valLeft, valRight) => {
  switch (relation) {
    case "equ":
      return valLeft === valRight;
    case "ne":
      return valLeft !== valRight;
    case "gt":
      return valLeft > valRight;
    case "gte":
      return valLeft >= valRight;
    case "lt":
      return valLeft < valRight;
    case "lte":
      return valLeft <= valRight;
    default:
      return false;
  }
};

const DayPicture = ({
  reFetch,
  patientId,
  readOnly,
  parentUiInform,
  data,
  // setParentData,
  mapResToData,
}) => {
  const classes = useStyles();
  const [dataCopy, setDataCopy] = React.useState(_.cloneDeep(data));

  const [failureWarnDial, setFailureWarnDial] = React.useState(false);

  const suggestFailureChange = (newColumnData, columnDate, statusGroup) => {
    let temData = {};
    if (!isSameDay(new Date(), columnDate)) return;

    let failure = interfaceGroupFailureCriteria[statusGroup].failure;
    let failureCriteria = failure ? failureProposerCriteria[failure] : null;
    if (!failureCriteria) return;

    if (
      failureCriteria.find((criteriaSet, i) => {
        return criteriaSet.every((criterium) => {
          let toCompare;
          if (criterium.statusMeasureType.readOnly) {
            toCompare = mathEval(
              criterium.statusMeasureType.formula,
              newColumnData
            );
            toCompare =
              toCompare.toString() === "Infinity" || isNaN(toCompare)
                ? null
                : toCompare;
          } else {
            toCompare = newColumnData[criterium.statusMeasureType.id];
            toCompare =
              criterium.statusMeasureType.valueType === "number"
                ? Number(toCompare)
                : toCompare;
          }
          if (!toCompare) {
            return criterium.ifNull;
          } else if (Array.isArray(criterium.value)) {
            return criterium.value.find((v) =>
              compare(criterium.relation, toCompare, v)
            );
          } else {
            return compare(criterium.relation, toCompare, criterium.value);
          }
        });
      })
    ) {
      temData[failure] = true;
    } else {
      temData[failure] = false;
    }

    let oldData = _.cloneDeep(dataCopy.failuresData);

    let newData = Object.assign(_.cloneDeep(oldData), temData);
    if (!_.isEqual(newData, oldData)) {
      let failureName = interfaceGroupFailureCriteria[statusGroup].name;
      parentUiInform && parentUiInform(
        `${failureName} ${temData[failure] ? "détectée" : "retirée"}`,
        "success"
      );

      submitFailureChecklist(patientId)(
        newData,
        (res) => {
          console.log("Data returned:", res);
          let temData = mapResToData ? mapResToData.failuresData(res.data) : res.data;
          setDataCopy(Object.assign(_.cloneDeep(dataCopy), {failuresData: temData}));
          console.log("Data returnedset:", Object.assign(_.cloneDeep(dataCopy), {failuresData: temData}));
        },
        (err) => manageError(err, console.error)
      );
    }
  };

  return (
    <React.Fragment>
      <Box
        border={1}
        style={{
          padding: "15px",
          margin: "5px",
          borderWidth: "1px",
          borderColor: "white",
          borderRadius: "15px",
        }}
      >
        <Grid container spacing={2} justify="space-around">
          <Grid xs={12} sm={8} item container>
            <Grid xs={12} item>
              <Box className={classes.title}>
                <Typography variant="h4">Photo du jour</Typography>
              </Box>
            </Grid>

            <Grid xs={12} item>
              <EditableText
                patientId={patientId}
                label="Décrit l'état du patient à ce jour"
                title="Notes du jour"
                variant="extensible"
                data={dataCopy.dayNoticeData}
                readOnly={readOnly}
                parentUiInform={parentUiInform}
                mapResToData={mapResToData.dayNoticeData}
                processSubmit={submitEditableText("day_notice", patientId)}
              />
            </Grid>
          </Grid>

          <Grid xs={12} sm={4} item>
            <CheckList
              labels={failuresInterface}
              title="Défaillances"
              data={dataCopy.failuresData}
              customIcons={failuresIcons}
              readOnly={true}
            />
          </Grid>

          <Grid xs={12} sm={12} item>
            <MeasuresTable
              patientId={patientId}
              data={dataCopy.statusMeasuresData}
              reFetch={reFetch}
              onMeasureSubmit={suggestFailureChange}
              readOnly={readOnly}
              parentUiInform={parentUiInform}
            />
          </Grid>
        </Grid>
      </Box>

      <Dialog open={failureWarnDial} onClose={() => setFailureWarnDial(false)}>
        <DialogTitle>Capteur de défaillance</DialogTitle>
        <DialogContent>Les défaillances ont changé</DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DayPicture;
