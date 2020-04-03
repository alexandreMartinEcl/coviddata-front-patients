export function dateTimeToString(value) {
    const date = new Date(value);
    return (
        date.toLocaleDateString("fr-FR") +
        " à " +
        date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        })
    );
}

/**
 * Returns how many days spent between value and now, under the format 'Jxx'
 * @param {Date} value 
 */
export function dateToDayStep(value) {
    return `J${Math.floor(( Date.now() - Date(value) ) / 86400000) + 1}`;
}
