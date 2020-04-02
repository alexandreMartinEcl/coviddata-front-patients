import React from "react";
import SortingTable from "../components/SortingTable";
import { FaPencilAlt } from "react-icons/fa";
import { getColumns, transformFields } from "../shared/utils/table";
import getSOFAfromData, { color } from "../shared/utils/sofaScore";
import { global } from "../config";

function VentilationsTable({ id, data, setVentilation, ...props }) {
    const properties = global.properties.ventilation;
    const columns = getColumns(properties, ["id", "patient"]);

    const SOFA = [];
    data.results.forEach(e => {
        SOFA.push(getSOFAfromData(e));
        transformFields(e, properties);
    });

    if (!columns.length) return <></>;

    return (
        <SortingTable
            title={`Ventilations du patient ${id}`}
            columns={columns}
            data={data.results}
            options={{
                rowStyle: rowData => ({
                    backgroundColor: color(SOFA[rowData.id])
                })
            }}
            actions={[
                {
                    icon: () => <FaPencilAlt />,
                    onClick: (e, rowData) => setVentilation(rowData.id),
                    tooltip: "Éditer"
                }
            ]}
            {...props}
        />
    );
}

export default VentilationsTable;
