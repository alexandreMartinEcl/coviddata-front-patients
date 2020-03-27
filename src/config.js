const baseURL = "http://80.14.192.60:3002/api/";

export default {
    axios: { baseURL },
    path: {
        patient: "patients/",
        ventilation: "ventilations/",
        ventilation_patient: "history/"
    },
    schema_list: ["form/patients", "form/ventilations"]
};

export const translate = {
    table: {
        add: "Mettre à jour"
    },
    button: {
        add: "Ajouter",
        change: "Modifier",
        return: "Retour"
    }
};

export const global = {};
