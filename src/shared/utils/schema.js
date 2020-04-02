// react-jsonschema-form

import { collectProperties } from "./table";
import * as _ from "lodash";

export function cloneSchema(schema) {
    const _schema = _.cloneDeep(schema);
    return {
        schema: _schema,
        properties: collectProperties(_schema)
    };
}

export function getType(obj) {
    switch (obj.type) {
        case "integer":
            return obj.enumNames ? "enumNames" : "number";
        case "string":
            return obj.format ? obj.format : "string";
        default:
            return obj.type;
    }
}

export function initSchema(properties, initialData) {
    for (const key in initialData) {
        const value = initialData[key];
        switch (getType(properties[key])) {
            case "string":
                properties[key].default = String(value);
                break;
            case "data-url":
                if (value) properties[key].default = value;
                break;
            default:
                properties[key].default = value;
        }
    }
}

export function flat(data, collect = {}) {
    for (const key in data) {
        const value = data[key];
        if (typeof value === "object") flat(value, collect);
        else collect[key] = value;
    }
    return collect;
}
