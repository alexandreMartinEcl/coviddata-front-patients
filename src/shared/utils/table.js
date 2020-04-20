// material-table + react-jsonschema-form

import { dateTimeToString } from "./date";
import { getType } from "./schema";
import moment from "moment";

export function collectProperties(obj, collect = {}, parent) {
  function compact(properties, collect) {
    for (const field in properties) {
      const value = properties[field];
      if (value.type === "object") collectProperties(value, collect, field);
      else if (parent) value.parent = parent;
      collect[field] = value;
    }
    return collect;
  }
  return collect;
}

//   if (obj.properties) compact(obj.properties, collect);
//   else for (const key in obj) collectProperties(obj[key], collect, key);
//   if (obj.dependencies) collectProperties(obj.dependencies, collect);
//   return collect;
// }

export function getColumns(properties, filter) {
  return Object.entries(properties)
    .map(([key, value]) =>
      filter.includes(key)
        ? null
        : {
            title: value.title,
            field: key,
            hidden: !!value.hidden,
          }
    )
    .filter((item) => item);
}

export function getFieldsFromType(properties, type, fields = []) {
  for (const key in properties) {
    const value = properties[key];
    if (value.format === type) fields.push(key);
  }
  return fields;
}

export function transformFields(data, properties) {
  for (const key in data) {
    const value = data[key];
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
  }
}

export function dataToList(data, properties) {
  return Object.entries(data).map(([key, value]) => ({
    title: properties[key].title,
    content: value,
    category: properties[key].parent,
  }));
}
