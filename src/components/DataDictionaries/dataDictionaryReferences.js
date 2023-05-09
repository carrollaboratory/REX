import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./dataDictionaryReferences.css";
import { CodeableConcept } from "../tables/codeableConcept";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import { myContext } from "../../App";

function DataDictionaryReferences() {
  const [reference, setReference] = useState({});
  const location = useLocation();
  const { selectedDictionaryReferences } = location.state;
  const [codeableConceptReference, setCodeableConceptReference] = useState({});
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { loading, setLoading } = useContext(myContext);

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  const capitalizeWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const navigate = useNavigate();
  useEffect(() => {
    // setLoading(true);
    getData();
  }, [selectedDictionaryReferences]);

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const getData = async () => {
    Promise.all(
      selectedDictionaryReferences?.observationResultRequirement.map((c) =>
        fetch(`https://anvil-fhir-vumc.uc.r.appspot.com/fhir/${c.reference}`)
      )
    )
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((res) => {
        setReference(res);
        // setLoading(false);
      });
  };

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
                <thead>
                  <tr>
                    <th className="dd-header-title" colSpan="3">
                      {
                        selectedDictionaryReferences?.title
                          .split(" ")[3]
                          .split("_")[0]
                      }
                      &nbsp;
                      {capitalizeWord(
                        selectedDictionaryReferences?.title.split(".").pop()
                      )}
                    </th>
                  </tr>
                  <tr>
                    <th className="dd-variable-name">Variable Name</th>
                    <th className="dd-variable-description">
                      Variable Description
                    </th>
                    <th className="dd-data-type">Permitted Data Type</th>
                  </tr>
                </thead>
                <tbody>
                  {reference?.map((r, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="dd-variable-name">
                            {r?.code?.coding?.[0]?.code}
                          </td>
                          <td className="dd-variable-description">
                            {r?.code?.coding?.[0]?.display}
                          </td>
                          <td className="dd-data-type">
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
              <button
                className="dd-button"
                onClick={() => navigate("/dataDictionary")}
              >
                Back to Search
              </button>
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
