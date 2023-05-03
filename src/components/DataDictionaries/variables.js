import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { CodeableConcept } from "../tables/codeableConcept";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import { Link } from "react-router-dom";

export const Variables = ({ capitalizeWord }) => {
  const { loading, setLoading } = useContext(myContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [observationData, setObservationData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [codeableConceptReference, setCodeableConceptReference] = useState({});
  const [codeableConcept, setCodeableconcept] = useState(false);

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

  const observationDefinitionUrl = () => {
    getFilteredItems().map((r) => {
      if (r.resource.resourceType === "ObservationDefinition") {
        return r.fullUrl.slice(46);
      }
    });
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
          <thead>
            <tr>
              <th className="dd-variable-name">Variable Name</th>
              <th className="dd-variable-description">Variable Description</th>
              <th className="dd-data-type">Permitted Data Type</th>
              <th className="dd-associated-dd">Associated Table</th>
            </tr>
          </thead>
          <tbody>
            {observationData.map((r, index) => (
              <>
                <tr key={index}>
                  <td>{r?.resource?.code?.coding?.[0]?.code}</td>

                  <td>{r?.resource?.code?.coding?.[0]?.display}</td>

                  <td>
                    {r?.resource?.permittedDataType[0] === "CodeableConcept" ? (
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
                    ) : (
                      r?.resource?.permittedDataType[0]
                    )}
                  </td>

                  <td>{getObservationMatch(r)}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-results">No results found.</div>
      )}
      {codeableConcept && (
        <CodeableConcept
          toggleModal={setCodeableconcept}
          codeableConceptReference={codeableConceptReference}
        />
      )}
    </>
  );
};
