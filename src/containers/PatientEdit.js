import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Form from "../components/Form";
import PatientEditTemplate from "../templates/PatientEdit";
import { getFieldsFromType } from "../shared/utils/table";
import { initSchema, cloneSchema } from "../shared/utils/schema";
import config, { global } from "../config";
import uiSchema from "../json/uiSchemaPatient.json";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function PatientEdit({ id, data = {} }) {
    const { schema, properties } = cloneSchema(global.schema.patient);

    if (!id) {
        const dateFields = getFieldsFromType(properties, "date");
        dateFields.forEach(e => (data[e] = moment().format("YYYY-MM-DD")));
    }

    initSchema(schema.properties, data);

    function onSubmit(data) {
        const formData = new FormData();

        for (let [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        const url = config.path.patient + (id ? `${id}/` : "");
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
                setPage(`/patient`);
            })
            .catch(err => {
                console.log(err);
                setPage(`/patient`);
            });
    }

    const [page, setPage] = useState();

    const components = {
        Form: props => (
            <Form
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={form => onSubmit(form.formData)}
            />
        )
    };

    return page ? (
        <Redirect push to={page} />
    ) : (
        <PatientEditTemplate components={components} />
    );
}

export default PatientEdit;
