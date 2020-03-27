// react-jsonschema-form

import { flattenProperties } from "./table";
import * as _ from "lodash";

export function cloneSchema(schema) {
    const _schema = _.cloneDeep(schema);
    return {
        schema: _schema,
        properties: flattenProperties(_schema.properties)
    };
}

export function getType(obj) {
    switch (obj.type) {
        case "object":
        case "boolean":
            return obj.type;
        case "number":
            return "number";
        case "integer":
            return obj.enumNames ? "enumNames" : "number";
        case "string":
            return obj.format ? obj.format : "string";
        default:
            return;
    }
}

export function initSchema(properties, initialData) {
    Object.entries(initialData).forEach(([key, value]) => {
        switch (getType(properties[key])) {
            case "string":
                properties[key].default = String(value);
                return;
            case "data-url":
                if (value) properties[key].default = value;
                return;
            default:
                properties[key].default = value;
        }
    });
}
