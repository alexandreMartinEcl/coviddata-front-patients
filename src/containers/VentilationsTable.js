import React, { useState, useEffect, useRef } from "react";
import SortingTable from "../components/SortingTable";
import { FaPencilAlt } from "react-icons/fa";
import { getColumns, transformFields } from "../shared/utils/table";
import getSOFAfromData, { color } from "../shared/utils/sofaScore";
import { global } from "../config";

function VentilationsTable({ id, data, setVentilation, ...props }) {
    const [columns, setColumns] = useState([]);
    const refSOFA = useRef([]);

    useEffect(() => {
        const properties = global.properties.ventilation;
        setColumns(getColumns(properties, ["id", "patient"]));

        const SOFA = [];
        data.results.forEach(e => {
            SOFA.push(getSOFAfromData(e));
            transformFields(e, properties);
            refSOFA.current = SOFA;
        });
    }, [data]);

    if (!columns.length) return <></>;

    return (
        <SortingTable
            title={`Ventilations du patient ${id}`}
            columns={columns}
            data={data.results}
            options={{
                rowStyle: rowData => ({
                    backgroundColor: color(refSOFA.current[rowData.id])
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
