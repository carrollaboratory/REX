import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./dataDictionaryReferences.css";

function DataDictionaryReferences() {
  const [reference, setReference] = useState({});
  const location = useLocation();
  const { selectedDictionaryReferences } = location.state;
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, [selectedDictionaryReferences]);

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
      });
  };

  return (
    <>
      {/* <button onClick={() => setDictionaryTableDetails(false)}>Back</button> */}
      {
        //   loading ? (
        //     <LoadingSpinner />
        //   ) :
        reference?.length > 0 ? (
          <>
            <div className="dd-table-wrapper">
              <table className="dd-table">
                <thead>
                  <tr>
                    <th className="dd-header-title" colspan="3">
                      {selectedDictionaryReferences?.title}
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
                  {reference?.map((r) => {
                    return (
                      <>
                        <tr>
                          <td className="dd-variable-name">
                            {r?.code?.coding?.[0]?.code}
                          </td>
                          <td className="dd-variable-description">
                            {r?.code?.coding?.[0]?.display}
                          </td>
                          <td className="dd-data-type">
                            {r?.permittedDataType[0] === "CodeableConcept" ? (
                              <div
                                style={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                                // onClick={() => {
                                //   handleCodeableConceptClick(
                                //     r?.validCodedValueSet?.reference
                                //   );
                                // }}
                              >
                                {r?.permittedDataType[0]}
                              </div>
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
              {/* <tr id="no-border" colspan="3"> */}
              <button
                className="dd-button"
                onClick={() => navigate("/dataDictionary")}
              >
                Back to All Dictionaries
              </button>
              {/* </tr> */}
            </div>
          </>
        ) : (
          ""
        )
      }
      {/* {codeableConcept && (
        <CodeableConcept
          toggleModal={setCodeableconcept}
          codeableConceptReference={codeableConceptReference}
        />
      )} */}
    </>
  );
}

export default DataDictionaryReferences;
