import React from "react";
import { useParams } from "react-router-dom";
import BuiForm from "@rjsf/core";
import Button from "@material-ui/core/Button";

function Form(props) {
    const { id } = useParams();
    return (
        <BuiForm {...props}>
            <Button type="submit" variant="contained" color="primary">
                {id ? "Modifier" : "Ajouter"}
            </Button>
        </BuiForm>
    );
}

export default Form;
