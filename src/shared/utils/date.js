export function dateTimeToString(value) {
  const date = new Date(value);
  return (
    date.toLocaleDateString("fr-FR") +
    " à " +
    date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

/**
 * Returns how many days spent between value and now, under the format 'Jxx'
 * @param {Date} value
 */
export function dateToDayStep(value) {
  value = new Date(value);
  let actValue = new Date(value.getFullYear(), value.getMonth(), value.getDate());
  return `J${Math.floor((new Date() - new Date(actValue)) / 86400000) + 1}`;
}

export function dateToStr(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
  };

  return new Date(date).toLocaleDateString("fr", options);
}

export function dateTimeToStr(date) {
  const options = {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(date).toLocaleDateString("fr", options);
}

export function getFormatDateFromFirst(firstDate, nbDays) {
  let resDate = new Date(firstDate).setDate(firstDate.getDate() + nbDays);
  return dateToStr(resDate);
}

export function getAge(birthDate) {
  return Math.floor((new Date() - new Date(birthDate)) / 31557600000);
}
