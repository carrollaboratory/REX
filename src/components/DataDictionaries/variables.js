import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { CodeableConcept } from "../tables/codeableConcept";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import { Link } from "react-router-dom";
import "./dataDictionary.css";

export const Variables = ({ capitalizeWord }) => {
  const { loading, setLoading } = useContext(myContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [observationData, setObservationData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [codeableConceptReference, setCodeableConceptReference] =
    useState(null);
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  const getFilteredItems = () => {
    if (!!searchTerm) {
      return observationData?.filter(
        (item) =>
          item?.resource?.code?.text &&
          item?.resource?.code?.text
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    } else {
      return observationData;
    }
  };

  const getObservationMatch = (observation) => {
    for (let activity of activityData) {
      for (const r of activity?.resource?.observationResultRequirement) {
        if (r.reference == observation?.fullUrl?.slice(46)) {
          return (
            <>
              <Link
                state={{
                  selectedDictionaryReferences: activity?.resource,
                }}
                to={`/dataDictionary/${activity?.resource?.id}`}
              >
                {activity?.resource?.title.split(" ")[3].split("_")[0]} &nbsp;
                {capitalizeWord(activity?.resource?.title.split(".").pop())}
              </Link>
            </>
          );
        }
      }
    }
  };

  useEffect(() => {
    fetchObservationDefinitions();
  }, []);

  const fetchObservationDefinitions = async () => {
    let observationArray = [];
    let activityArray = [];
    setLoading(true);
    setObservationData([]);
    searchTerm != ""
      ? fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ObservationDefinition?code:text=${searchTerm}&_revinclude=ActivityDefinition:result`,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            c.entry?.forEach((r) => {
              if (r?.resource?.resourceType === "ObservationDefinition") {
                observationArray.push(r);
                setObservationData(observationArray);
              } else {
                activityArray.push(r);
                setActivityData(activityArray);
              }
            });
            setLoading(false);
          })
      : fetch(
          "https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition?_include=ActivityDefinition:result",
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            c.entry.forEach((r) => {
              if (r?.resource?.resourceType === "ObservationDefinition") {
                observationArray.push(r);
                setObservationData(observationArray);
              } else {
                activityArray.push(r);
                setActivityData(activityArray);
              }
            });
            setLoading(false);
          });
  };

  return (
    <>
      <div className="search-input-dd">
        <input
          id="inputText"
          type="text"
          placeholder="Search by value..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />

        <button
          className="search-button"
          onClick={(e) => fetchObservationDefinitions()}
        >
          Search
        </button>

        <form>
          <button className="clear-button" onClick={() => setSearchTerm("")}>
            X
          </button>
        </form>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : observationData.length > 0 ? (
        <table>
          <thead className="data-dictionary-table-head">
            <tr>
              <th className="dd-variable-name table-head-DD">Variable Name</th>
              <th className="dd-variable-description table-head-DD">
                Variable Description
              </th>
              <th className="dd-data-type table-head-DD">
                Permitted Data Type
              </th>
              <th className="dd-associated-dd table-head-DD">
                Associated Table
              </th>
            </tr>
          </thead>
          <tbody>
            {observationData?.map((r, index) => {
              return (
                <>
                  <tr key={index} className="DD-colored-row">
                    <td className="table-cell-DD">
                      {r?.resource?.code?.coding?.[0]?.code}
                    </td>

                    <td className="table-cell-DD">
                      {r?.resource?.code?.coding?.[0]?.display}
                    </td>

                    <td className="table-cell-DD">
                      {r?.resource?.permittedDataType[0] ===
                      "CodeableConcept" ? (
                        <>
                          <div
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleCodeableConceptClick(
                                r?.resource?.validCodedValueSet?.reference
                              );
                            }}
                          >
                            {r?.resource?.permittedDataType[0]}
                          </div>
                          <div>
                            <CodeableConcept
                              className={
                                r?.resource?.validCodedValueSet?.reference ===
                                codeableConceptReference
                                  ? "codeableConcept"
                                  : "codeableConcept--closed"
                              }
                              isOpen={
                                r?.resource?.validCodedValueSet?.reference ===
                                codeableConceptReference
                              }
                              toggleModal={setCodeableConceptReference}
                              codeableConceptReference={
                                codeableConceptReference
                              }
                            />
                          </div>
                        </>
                      ) : (
                        r?.resource?.permittedDataType[0]
                      )}
                    </td>

                    <td className="table-cell-DD">{getObservationMatch(r)}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="no-results">No results found.</div>
      )}
      {/* {codeableConcept && (
        <CodeableConcept
          toggleModal={setCodeableconcept}
          codeableConceptReference={codeableConceptReference}
        />
      )} */}
    </>
  );
};
