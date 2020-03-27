import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Form from "../components/Form";
import { getFieldsFromType } from "../shared/utils/table";
import { initSchema, cloneSchema } from "../shared/utils/schema";
import config, { global } from "../config";
import uiSchema from "../json/uiSchemaVentilation.json";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function VentilationEdit({ id, patient, data = {} }) {
    const { schema, properties } = cloneSchema(global.schema.ventilation);

    if (!id) {
        const dateTimeFields = getFieldsFromType(properties, "date-time");
        dateTimeFields.forEach(e => (data[e] = new Date().toISOString()));
        data.patient = patient;
    }

    initSchema(schema.properties, data);

    schema.title += ` ${patient}`;

    function onSubmit(data) {
        const formData = new FormData();
        for (let [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
        const url = config.path.ventilation + (id ? `${id}/` : "");

        axios
            .post(url, formData, {
                ...config.axios,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Access-Control-Allow-Origin": "*"
                }
            })
            .then(res => {
                console.log(res);
                setPage(`/patient/${patient}`);
            })
            .catch(err => {
                console.log(err);
                setPage(`/patient/${patient}`);
            });
    }

    const [page, setPage] = useState();

    return page ? (
        <Redirect push to={page} />
    ) : (
        <Form
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={form => onSubmit(form.formData)}
        />
    );
}

export default VentilationEdit;
