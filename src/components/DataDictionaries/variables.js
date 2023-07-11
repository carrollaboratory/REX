import { useContext, useEffect, useState } from "react";
import { authContext, myContext } from "../../App";
import { CodeableConcept } from "../tables/codeableConcept";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import { Link } from "react-router-dom";
import "./dataDictionary.css";
import { SearchBar } from "./searchBar";

export const Variables = ({ capitalizeWord }) => {
  const { loading, setLoading, URL } = useContext(myContext);
  const { observationData, activityData, getVariables } =
    useContext(authContext);
  const [codeableConceptReference, setCodeableConceptReference] =
    useState(null);
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  // const getFilteredItems = () => {
  //   if (!!searchTerm) {
  //     return observationData?.filter(
  //       (item) =>
  //         item?.resource?.code?.text &&
  //         item?.resource?.code?.text
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase())
  //     );
  //   } else {
  //     return observationData;
  //   }
  // };

  useEffect(() => {
    getVariables();
  }, []);

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

  return (
    <>
      <SearchBar>
        {false ? (
          <LoadingSpinner />
        ) : observationData.length > 0 ? (
          <table>
            <thead className="data-dictionary-table-head">
              <tr>
                <th className="dd-variable-name table-head-DD">
                  Variable Name
                </th>
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

                      <td className="table-cell-DD">
                        {getObservationMatch(r)}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">No results found.</div>
        )}
      </SearchBar>
      {/* {codeableConcept && (
        <CodeableConcept
          toggleModal={setCodeableconcept}
          codeableConceptReference={codeableConceptReference}
        />
      )} */}
    </>
  );
};
