import React, { useEffect } from "react";
import useAxios from "axios-hooks";
import ErrorTemplate from "../../templates/Error";
import * as _ from "lodash";

function withDataFromFetch(Component, { url, config = {} }) {
    return props => {
        const [{ data, loading, error }, fetch] = useAxios(
            {
                ...config,
                url
            },
            { manual: true }
        );

        useEffect(() => {
            fetch();
        }, [fetch]);

        if (!data || loading) return <></>;
        if (error) return <ErrorTemplate />;

        return <Component data={_.cloneDeep(data)} {...props} />;
    };
}

export default withDataFromFetch;
