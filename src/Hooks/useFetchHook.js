import { useEffect, useState, useCallback } from "react";

const useFetch = (fetchFn, dependencies = []) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchFn()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        setData(null);
        setError(
          typeof err === "string" ? err : err.message || "Unknown error"
        );
        setLoading(false);
      });
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
