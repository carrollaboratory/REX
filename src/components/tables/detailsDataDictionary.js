import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import "./detailsDataDictionary.css";
import { DataDictionaryTableDetails } from "./dataDictionaryTableDetails/dataDictionaryTableDetails";
import { useNavigate } from "react-router-dom";

export const DetailsDataDictionary = ({ propData }) => {
  const { loading, setLoading, URL } = useContext(myContext);
  const [dataDictionary, setDataDictionary] = useState([]);
  const [selectedDictionaryReferences, setSelectedDictionaryReferences] =
    useState([]);
  const [dictionaryTableDetails, setDictionaryTableDetails] = useState(false);
  const [active, setActive] = useState(-1);

  const navigate = useNavigate();

  const capitalizeWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

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
      ? fetch(`${URL}/ActivityDefinition?_tag=${secondValue}_DD`, {
          method: "GET",
        })
      : fetch(`${URL}/ActivityDefinition?_tag=${firstValue}_DD`, {
          method: "GET",
        })
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
      {dataDictionary ? (
        <div className="DD-wrapper">
          <div className="DD-container">
            <div className="DD-title-list">
              <div className="DD-title-container">
                <div className="DD-title-box">
                  <div className="DD-header">
                    <h4>Variables for Data Dictionary Tables</h4>
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
                            {d?.resource?.title.split(" ")[3].split("_")[0]}
                            &nbsp;
                            {capitalizeWord(
                              d?.resource?.title.split(".").pop()
                            )}
                          </li>
                        </>
                      );
                    })}
                  </div>
                </div>
                <button
                  className="button-details-DD"
                  onClick={() => {
                    // setSelectedObject(null);
                    navigate("/");
                  }}
                >
                  Back
                </button>
              </div>
            </div>
            <div>
              {dictionaryTableDetails ? (
                <DataDictionaryTableDetails
                  selectedDictionaryReferences={selectedDictionaryReferences}
                  active={active}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-dictionaries">No data dictionaries available</div>
      )}
    </>
  );
};
