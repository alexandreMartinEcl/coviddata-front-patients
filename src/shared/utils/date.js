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
  let actValue = new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  );
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

/**
 * @param {Date} date1
 * @param {Date} date2
 */
export function isSameDay(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);

  return (
    date1.getDay() === date2.getDay() &&
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function setToMidnight(date) {
  let d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
