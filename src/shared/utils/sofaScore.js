function getPlace(value, array) {
  let i = 0;
  array.forEach((e) => {
    if (value < e) return;
    i++;
  });
  return i - 1;
}

// function getPlaceInv(value, array) {
//     return array.length - getPlace(value, array) + 1;
// }

// function SOFA(PaO2, GCS, CardioScore, Bilirubin, Platelets, Creatinine) {
//     let score = 0;
//     score += getPlaceInv(PaO2, [0, 100, 200, 300, 400]);
//     score += getPlaceInv(GCS, [0, 6, 10, 13, 15]);
//     score += CardioScore;
//     score += getPlace(Bilirubin, [0, 1.2, 2, 6, 12]);
//     score += getPlaceInv(Platelets, [0, 20, 50, 100, 150]);
//     score += getPlace(Creatinine, [0, 1.2, 2, 3.5, 5]);
//     return score;
// }

export default function getSOFAfromData(data) {
  return [
    "score_respiration_pao2_fio2",
    "score_coagulation",
    "score_hepatique",
    "score_cardiovasculaire",
    "score_neurologique",
    "score_renal_creatine",
    "score_renal_diurese",
  ]
    .map((e) => data[e])
    .reduce((a, b) => a + b, 0);
}

const colors = [
  "#f31d24",
  "#ff7b00",
  "#f4bb00",
  "#c0cc00",
  "#5cb400",
  "#00a3a3",
];

export function color(sofaScore) {
  const place = getPlace(sofaScore, [0, 6, 6.5, 7, 8, 9]);
  return colors[place];
}
