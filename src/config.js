const baseURL = "http://80.14.192.60:3002/api/";

export default {
    axios: { baseURL },
    basename: "/",
    path: {
        patient: "patients/",
        bed: "beds/",
        ventilation: "ventilations/",
        ventilation_patient: "history/"
    },
    schema_list: ["form/patients/", "form/ventilations/"]
};

export const translate = {
    table: {
        add: "Ajouter une nouvelle donnée"
    },
    button: {
        add: "Ajouter",
        change: "Modifier",
        return: "Retour"
    }
};

export const global = {
    bed: {
        columnField: {
            title: "columnTitle",
            hidden: false,
        }
    }
};
