import { useEffect, useState, useCallback } from "react";

const useFetch = (fetchFn, dependecies = []) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState();

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchFn()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          typeof err === "string" ? err : err.message || "Unknown error"
        );
        setLoading(false);
      });
  }, dependecies);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
