import React from "react";
import { useParams } from "react-router-dom";
import BuiForm from "@rjsf/core";
import Button from "@material-ui/core/Button";
import { translate } from "../config";

function Form(props) {
    const { id } = useParams();
    return (
        <BuiForm {...props}>
            <Button type="submit" variant="contained" color="primary">
                {id ? translate.button.change : translate.button.add}
            </Button>
        </BuiForm>
    );
}

export default Form;
