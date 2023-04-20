import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import "./detailsDataDictionary.css";
import { DataDictionaryTableDetails } from "./dataDictionaryTableDetails";

export const DetailsDataDictionary = ({ propData }) => {
  const { loading, setLoading } = useContext(myContext);
  const [dataDictionary, setDataDictionary] = useState([]);
  const [selectedDictionaryReferences, setSelectedDictionaryReferences] =
    useState([]);
  const [dictionaryTableDetails, setDictionaryTableDetails] = useState(false);

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
        setDataDictionary(d.entry);
      });
    setLoading(false);
  };

  // const getObservationReference =
  //   dataDictionary.observationResultRequirement.map((o, index) => {
  //     return fetch(`https://anvil-fhir-vumc.uc.r.appspot.com/fhir/`)
  //       .then((res) => res.json())
  //       .then((d) => {
  //         setData(d);
  //       });
  //   });

  const handleTitleClick = (array) => {
    setSelectedDictionaryReferences(array);
    setDictionaryTableDetails(true);
  };

  return !dictionaryTableDetails ? (
    <>
      <div className="DD-title-list">
        <h4>Available Data Dictionaries</h4>
        <div>
          {dataDictionary?.map((d, index) => {
            return (
              <>
                <li
                  key={index}
                  onClick={() =>
                    handleTitleClick(d.resource?.observationResultRequirement)
                  }
                >
                  <b>{d.resource.title}</b>
                </li>
                {/* <div>
                  {d.resource?.observationResultRequirement.map((r) => {
                    return (
                      <>
                        <div>{r.reference}</div>
                      </>
                    );
                  })}
                </div> */}
              </>
            );
          })}
        </div>
      </div>
    </>
  ) : (
    <DataDictionaryTableDetails
      selectedDictionaryReferences={selectedDictionaryReferences}
      setDictionaryTableDetails={setDictionaryTableDetails}
      dataDictionary={dataDictionary}
    />
  );
};

{
  /* <table>
  {dataDictionary.map((d, index) => {
    return (
      <>
        <thead>
          <tr key={index} className="table-head-row">
            <th className="th-title">{d.resource.title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </>
    );
  })}
</table> */
}
