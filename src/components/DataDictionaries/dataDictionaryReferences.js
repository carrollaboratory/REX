import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./dataDictionaryReferences.css";
import { CodeableConcept } from "../tables/codeableConcept";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import { authContext, myContext } from "../../App";

function DataDictionaryReferences() {
  // const [reference, setReference] = useState({});
  const location = useLocation();
  // const { selectedDictionaryReferences } = location.state;
  const [codeableConceptReference, setCodeableConceptReference] = useState({});
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const {
    selectedReference,
    setSelectedReference,
    setReference,
    getDataDictionaryReferences,
    reference,
    activityData,
    getVariables,
  } = useContext(myContext);

  const { DDReference } = useParams();

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  const capitalizeWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const navigate = useNavigate();

  useEffect(
    () => () => {
      setSelectedReference(undefined);
      setReference(undefined);
    },
    []
  );

  useEffect(() => {
    if (DDReference && !selectedReference) {
      getVariables();
    } else {
      getDataDictionaryReferences();
    }
  }, [selectedReference]);

  useEffect(() => {
    if (selectedReference === undefined && activityData) {
      activityData?.forEach((v) => {
        if (v?.resource?.id == DDReference) {
          setSelectedReference(v.resource);
        }
      });
    }
  }, [activityData]);

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // const getData = async () => {
  //   Promise.all(
  //     selectedDictionaryReferences?.observationResultRequirement.map((c) =>
  //       fetch(`${URL}/${c.reference}`)
  //     )
  //   )
  //     .then((responses) =>
  //       Promise.all(responses.map((response) => response.json()))
  //     )
  //     .then((res) => {
  //       setReference(res);
  //       // setLoading(false);
  //     });
  // };

  return (
    <>
      {/* <button onClick={() => setDictionaryTableDetails(false)}>Back</button> */}
      {
        // loading ? (
        //   <LoadingSpinner />
        // ) :
        reference?.length > 0 ? (
          <>
            <div className="dd-table-wrapper">
              <table className="dd-table">
                <thead className="table-head-DD">
                  <tr>
                    <th className="dd-header-title" colSpan="3">
                      {selectedReference?.title.split(" ")[3].split("_")[0]}
                      &nbsp;
                      {capitalizeWord(
                        selectedReference?.title.split(".").pop()
                      )}
                    </th>
                  </tr>
                  <tr>
                    <th className="dd-variable-name table-head-DDR">
                      Variable Name
                    </th>
                    <th className="dd-variable-description table-head-DDR">
                      Variable Description
                    </th>
                    <th className="dd-data-type table-head-DDR">
                      Permitted Data Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reference?.map((r, index) => {
                    return (
                      <>
                        <tr key={index} className="DDR-colored-row">
                          <td className="dd-variable-name table-cell-DDR">
                            {r?.code?.coding?.[0]?.code}
                          </td>
                          <td className="dd-variable-description table-cell-DDR">
                            {r?.code?.coding?.[0]?.display}
                          </td>
                          <td className="dd-data-type table-cell-DDR">
                            {r?.permittedDataType[0] === "CodeableConcept" ? (
                              <>
                                {" "}
                                <div
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handleCodeableConceptClick(
                                      r?.validCodedValueSet?.reference
                                    );
                                  }}
                                >
                                  {r?.permittedDataType[0]}
                                </div>
                                <div>
                                  <CodeableConcept
                                    className={
                                      r?.validCodedValueSet?.reference ===
                                      codeableConceptReference
                                        ? "codeableConcept"
                                        : "codeableConcept--closed"
                                    }
                                    isOpen={
                                      r?.validCodedValueSet?.reference ===
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
                              r?.permittedDataType[0]
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
              {/* <tr id="no-border" colSpan="3"> */}
              {/* 
              <button className="dd-button" onClick={() => navigate(-1)}>
                Back to Search
              </button> */}

              {/* </tr> */}
            </div>
          </>
        ) : (
          ""
        )
      }
    </>
  );
}

export default DataDictionaryReferences;
