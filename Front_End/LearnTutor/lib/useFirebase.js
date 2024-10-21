import { useState, useEffect } from "react";
import { Alert } from "react-native";

//custom hook that can be used in all pages
const useFirebase = (fn) => {
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //for async code a function within must be used for logic, for some reason without it, it is considered illegal
  //upon page load this effect should occur

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn();

      setData(response);
    } catch (Error) {
      Alert.alert("Error", Error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useFirebase;
