import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import SortingTable from "../components/SortingTable";
import Button from "@material-ui/core/Button";
import { FaPlus, FaEye, FaPencilAlt } from "react-icons/fa";
import { getColumns, transformFields } from "../shared/utils/table";
// import { color } from "../shared/utils/sofaScore";
import { global } from "../config";

function PatientsTable({ data, ...props }) {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const properties = global.properties.patient;
        setColumns(getColumns(properties, ["id"]));

        data.results.forEach(e => {
            transformFields(e, properties);
        });
    }, [data]);

    const [page, setPage] = useState();

    if (!columns.length) return <></>;

    return page ? (
        <Redirect push to={page} />
    ) : (
        <SortingTable
            title="Liste des patients"
            columns={columns}
            data={data.results}
            options={{
                pageSize: 10
            }}
            actions={[
                {
                    icon: () => (
                        <Button
                            onClick={() => setPage("/patient/add")}
                            variant="contained"
                            color="primary"
                        >
                            <FaPlus />
                            Ajouter un patient
                        </Button>
                    ),
                    onClick: () => {},
                    isFreeAction: true
                },
                {
                    icon: () => <FaEye />,
                    onClick: (e, rowData) => setPage(`/patient/${rowData.id}`),
                    tooltip: "Visualiser"
                },
                {
                    icon: () => <FaPencilAlt />,
                    onClick: (e, rowData) =>
                        setPage(`/patient/edit/${rowData.id}`),
                    tooltip: "Éditer"
                }
            ]}
            {...props}
        />
    );
}

export default PatientsTable;
