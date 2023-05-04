import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import "./dataDictionaryTableDetails.css";
import { Link } from "react-router-dom";
import { CodeableConcept } from "./codeableConcept";

export const DataDictionaryTableDetails = ({
  selectedDictionaryReferences,
  setDictionaryTableDetails,
}) => {
  const [reference, setReference] = useState({});
  const { loading } = useContext(myContext);
  const [codeableConceptReference, setCodeableConceptReference] =
    useState(null);
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const width = window.innerWidth;

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  useEffect(() => {
    getData();
  }, [selectedDictionaryReferences]);

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);
  }, []);

  const getData = async () => {
    Promise.all(
      selectedDictionaryReferences.map((c) =>
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
          <div className="table-wrapper">
            <div>
              <table>
                <thead>
                  <tr>
                    <th className="variable-name">Variable Name</th>
                    <th className="variable-description">
                      Variable Description
                    </th>
                    <th className="data-type">Permitted Data Type</th>
                  </tr>
                </thead>
                <tbody>
                  {reference?.map((r) => {
                    return (
                      <>
                        <tr>
                          <td className="variable-name">
                            {r?.code?.coding?.[0]?.code}
                          </td>
                          <td className="variable-description">
                            {r?.code?.coding?.[0]?.display}
                          </td>
                          <td className="data-type">
                            {r?.permittedDataType[0] === "CodeableConcept" ? (
                              <>
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
            </div>
          </div>
        ) : (
          ""
        )
      }
    </>
  );
};
