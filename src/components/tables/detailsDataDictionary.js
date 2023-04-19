import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";

export const DetailsDataDictionary = ({ propData }) => {
  const { loading, setLoading } = useContext(myContext);
  const [dataDictionary, setDataDictionary] = useState({});

  const valueSplit =
    propData?.resource.identifier?.[0]?.value.split("_").length;

  const secondValue = propData?.resource.identifier?.[0]?.value.split("_")[1];

  const firstValue = propData?.resource.identifier?.[0]?.value.split("_")[0];

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const getData = async () => {
    await (valueSplit > 2
      ? fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition?_tag=${secondValue}_DD`,
          {
            method: "GET",
          }
        )
      : fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition?_tag=${firstValue}_DD`,
          {
            method: "GET",
          }
        )
    )
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        setDataDictionary(d);
      });
    setLoading(false);
  };

  return (
    <>
      <div>Table goes here</div>
    </>
  );
};
