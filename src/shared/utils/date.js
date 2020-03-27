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
