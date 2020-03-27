import React from "react";
import PatientContentTemplate from "../templates/PatientContent";
import { transformFields, dataToList } from "../shared/utils/table";
import { global } from "../config";

function PatientContent({ id, data }) {
    const properties = global.properties.patient;

    transformFields(data, properties);
    const list = dataToList(data, properties);

    const listByCategory = {};
    list.forEach(e => {
        if (e.category === "") e.category = "default";
        if (!listByCategory[e.category]) listByCategory[e.category] = [];
        listByCategory[e.category].push({ title: e.title, content: e.content });
    });

    return <PatientContentTemplate listByCategory={listByCategory} />;
}

export default PatientContent;
