import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as _ from "lodash";

import { MeasuresTable, EditableText, CheckList } from "./Components";

import {
  HeartFailureIcon,
  BioChemicalFailureIcon,
  BrainFailureIcon,
  LungFailureIcon,
  KidneyFailureIcon,
  LiverFailureIcon,
} from "../shared/icons/index";

import statusMeasuresInterface from "../json/statusMeasures.json";
import { isSameDay } from "../shared/utils/date";
import {
  Typography,
  Grid,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@material-ui/core";

const failureProposerCriteria = [
  {
    statusMeasureType: statusMeasuresInterface.eer,
    relation: "ne",
    value: "",
    failure: "kidney_failure",
    toSet: true,
  },
  {
    statusMeasureType: statusMeasuresInterface.lactat,
    relation: "gte",
    value: 2.0,
    failure: "kidney_failure",
    toSet: true,
  },
  {
    statusMeasureType: statusMeasuresInterface.p_f,
    relation: "lte",
    value: 200,
    failure: "kidney_failure",
    toSet: true,
  },
  {
    statusMeasureType: statusMeasuresInterface.nad,
    relation: "lte",
    value: 200,
    failure: "kidney_failure",
    toSet: true,
  },
];

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

function DayPicture({ data = {}, reFetch, patientId, readOnly }) {
  const { id } = useParams();

  const [childTableData, setChildTableData] = useState(null);

  const [failureChange, setFailureChange] = React.useState({});
  const [failureWarnDial, setFailureWarnDial] = React.useState(false);

  const { day_notice, last_edited_day_notice } = data;
  const dataDayNotice = {
    text: day_notice,
    lastEdited: last_edited_day_notice,
  };

  const {
    heart_failure,
    bio_chemical_failure,
    brain_failure,
    lung_failure,
    kidney_failure,
    liver_failure,
  } = data;
  const dataFailures = {
    heart_failure,
    bio_chemical_failure,
    brain_failure,
    lung_failure,
    kidney_failure,
    liver_failure,
  };

  const suggestFailureChange = (jsonDataSubmitted) => {
    let temData = {};
    jsonDataSubmitted
      .filter((sm) => isSameDay(new Date(), sm.created_date))
      .forEach((statusMeasure) => {
        let criterium = failureProposerCriteria.find((c) => {
          console.log(
            c.statusMeasureType.small,
            c.statusMeasureType.dbValue.toString(),
            statusMeasure.status_type
          );
          console.log(
            c.statusMeasureType.dbValue.toString() === statusMeasure.status_type
          );
          return (
            c.statusMeasureType.dbValue.toString() === statusMeasure.status_type
          );
        });
        if (criterium) {
          if (
            compare(criterium.relation, statusMeasure.value, criterium.value)
          ) {
            temData[criterium.failure] = criterium.toSet;
          }
        }
      });

    console.log(temData);
    if (Object.keys(temData).length) {
      let temDataFailures = _.cloneDeep(dataFailures);
      Object.assign(temDataFailures, temData);

      if (!_.isEqual(temDataFailures, failureChange)) {
        setFailureWarnDial(true);
      }
      setFailureChange(_.cloneDeep(temDataFailures));
    }
  };

  const failuresInterface = {
    heart_failure: "Défaillance cardiaque",
    bio_chemical_failure: "Défaillance biochimie",
    brain_failure: "Défaillance cérébrale",
    lung_failure: "Défaillance pulmonaire",
    kidney_failure: "Défaillance rénale",
    liver_failure: "Défaillance hépatique",
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
  };

  let dataMeasures;
  const { status_measures, unit_stays } = data;
  dataMeasures = { measures: status_measures };
  if (unit_stays && unit_stays.length) {
    dataMeasures.hospitalisationDate = new Date(
      Math.min(...unit_stays.map((s) => new Date(s.start_date)))
    );
    dataMeasures.hospitalisationEndDate = unit_stays.filter(
      (s) => !s.is_finished
    ).length
      ? null
      : new Date(Math.max(...unit_stays.map((s) => new Date(s.end_date))));
  }
  if (data.weight_kg) {
    dataMeasures.weight_kg = data.weight_kg;
  }

  return (
    <React.Fragment>
      <Typography variant="h3">Photo du jour</Typography>
      <Grid container spacing={2} justify="space-around">
        <Grid xs={12} sm={8} item>
          <EditableText
            patientId={id}
            label="Décrit l'état du patient à ce jour"
            title="Notes du jour"
            extensibleElseDial={true}
            data={dataDayNotice}
            field="day_notice"
            reFetch={reFetch}
            readOnly={readOnly}
          />
        </Grid>

        <Grid xs={12} sm={4} item>
          <CheckList
            patientId={id}
            title="Défaillances"
            data={{ checks: dataFailures }}
            dataInterface={failuresInterface}
            suggestedData={failureChange}
            setSuggestedData={setFailureChange}
            customIcons={failuresIcons}
            readOnly={readOnly}
          />
        </Grid>

        <Grid xs={12} sm={12} item>
          <MeasuresTable
            patientId={id}
            patient={id}
            data={dataMeasures}
            reFetch={reFetch}
            forcedTableData={childTableData}
            updateParentTableData={setChildTableData}
            onMeasureSubmit={suggestFailureChange}
            readOnly={readOnly}
          />
        </Grid>
      </Grid>

      <Dialog open={failureWarnDial} onClose={() => setFailureWarnDial(false)}>
        <DialogTitle>Capteur de défaillance</DialogTitle>
        <DialogContent>
          Des potentielles défaillances ont été détectées, vérifiez la zone
          défaillance
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DayPicture;
