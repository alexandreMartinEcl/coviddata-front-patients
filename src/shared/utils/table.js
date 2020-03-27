// material-table + react-jsonschema-form

import { dateTimeToString } from "./date";
import { getType } from "./schema";
import moment from "moment";
import * as _ from "lodash";

export function flattenProperties(properties) {
    function scanProperties(properties, fun) {
        function scan(properties, fun, parent = "") {
            return Object.entries(properties).map(([key, value]) => {
                if (value.properties) return scan(value.properties, fun, key);
                return fun(key, value, parent);
            });
        }
        return _.flattenDeep(scan(properties, fun));
    }

    const a = scanProperties(properties, (key, value, parent) => {
        if (value.parent)
            return {
                key,
                value
            };
        return {
            key,
            value: { ...value, parent }
        };
    });
    return Object.fromEntries(new Map(a.map(e => [e.key, e.value])));
}

export function getColumns(properties, filter) {
    return Object.entries(properties)
        .map(([key, value]) =>
            filter.includes(key)
                ? null
                : {
                      title: value.title,
                      field: key,
                      hidden: !!value.hidden
                  }
        )
        .filter(item => item);
}

export function getFieldsFromType(properties, type) {
    const fields = [];
    Object.entries(properties).forEach(([key, value]) => {
        if (value.format === type) fields.push(key);
    });
    return fields;
}

export function transformFields(data, nestedProperties) {
    const properties = flattenProperties(nestedProperties);

    Object.entries(data).forEach(([key, value]) => {
        const obj = properties[key];
        if (!obj) return;
        switch (getType(obj)) {
            case "object":
                break;
            case "boolean":
                data[key] = value ? "Oui" : "Non";
                break;
            case "number":
                break;
            case "string":
                break;
            case "enumNames":
                data[key] = obj.enumNames[value];
                break;
            case "date":
                data[key] = moment(value).format("DD/MM/YYYY");
                break;
            case "date-time":
                data[key] = dateTimeToString(value);
                break;
            default:
        }
    });
}

export function dataToList(data, properties) {
    return Object.entries(data).map(([key, value]) => ({
        title: properties[key].title,
        content: value,
        category: properties[key].parent
    }));
}
