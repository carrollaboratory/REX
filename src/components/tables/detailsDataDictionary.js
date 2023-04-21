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
  const [active, setActive] = useState(-1);

  const valueSplit =
    propData?.resource.identifier?.[0]?.value.split("_").length;

  const secondValue = propData?.resource.identifier?.[0]?.value.split("_")[1];

  const firstValue = propData?.resource.identifier?.[0]?.value.split("_")[0];

  useEffect(() => {
    setLoading(true);
    getData();
  }, [selectedDictionaryReferences]);

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

  const handleTitleClick = (array) => {
    setSelectedDictionaryReferences(array);
    setDictionaryTableDetails(true);
  };

  return (
    <>
      <div className="DD-wrapper">
        <div className="DD-container">
          <div className="DD-title-list">
            <div className="DD-title-container">
              <div className="DD-header">
                <h4>Available Data Dictionaries</h4>
              </div>
              <div className="DD-titles">
                {dataDictionary?.map((d, index) => {
                  return (
                    <>
                      <li
                        key={index}
                        onClick={() => {
                          handleTitleClick(
                            d.resource?.observationResultRequirement
                          );
                          setActive(index);
                        }}
                        style={{
                          fontWeight: active === index ? "bold" : "",
                          textDecoration:
                            active === index ? "none" : "underline",
                          cursor: active === index ? "default" : "pointer",
                        }}
                      >
                        {d.resource.title}
                      </li>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            {dictionaryTableDetails ? (
              <DataDictionaryTableDetails
                selectedDictionaryReferences={selectedDictionaryReferences}
                setDictionaryTableDetails={setDictionaryTableDetails}
                dataDictionary={dataDictionary}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
