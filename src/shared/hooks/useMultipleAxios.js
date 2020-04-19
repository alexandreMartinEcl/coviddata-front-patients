import { useState, useEffect } from "react";
import axios from "axios";

function useMultipleAxios(urlArray, config = {}) {
  const n = urlArray.length;

  const [dataArray, setDataArray] = useState([]);
  const [nOfLoaded, setNOfLoaded] = useState(0);
  const [nOfErrors, setNOfErrors] = useState(0);

  useEffect(() => {
    urlArray.forEach((url, i) => {
      axios
        .get(url, config)
        .then((reponse) => {
          setDataArray((array) => {
            array[i] = reponse.data;
            return array;
          });
          setNOfLoaded((n) => ++n);
        })
        .catch((error) => {
          setNOfErrors((n) => ++n);
        });
    });
  }, [config, urlArray]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(nOfLoaded !== n);
  }, [nOfLoaded, n]);

  useEffect(() => {
    setError(!!nOfErrors);
  }, [nOfLoaded, nOfErrors]);

  return { data: dataArray, loading, error };
}

export default useMultipleAxios;
