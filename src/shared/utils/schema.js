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
    Object.entries(properties).forEach(([key, value]) => {
        if (value.properties) initSchema(value.properties, initialData);
        else {
            const defaultValue = initialData[key];
            if (defaultValue) {
                switch (getType(properties[key])) {
                    case "string":
                        properties[key].default = String(defaultValue);
                        return;
                    case "data-url":
                        properties[key].default = defaultValue;
                        return;
                    default:
                        properties[key].default = defaultValue;
                }
            }
        }
    });
}
