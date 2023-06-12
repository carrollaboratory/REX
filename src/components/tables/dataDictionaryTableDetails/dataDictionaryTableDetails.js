import React, { useContext, useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner/loadingSpinner";
import "./dataDictionaryTableDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { TableRow } from "./tableRow";
import { myContext } from "../../../App";

export const DataDictionaryTableDetails = ({
  selectedDictionaryReferences,
  setDictionaryTableDetails,
}) => {
  const [reference, setReference] = useState({});
  const [loading, setLoading] = useState(true);
  const [codeableConceptReference, setCodeableConceptReference] =
    useState(null);
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [system, setSystem] = useState({});
  const { studyId } = useParams();
  const { URL } = useContext(myContext);

  const handleSummaryClick = (e) => {
    setSystem(e);
    window.open(`/variable-summary/${studyId}`, "_blank");
  };

  useEffect(() => {
    getData();
  }, [selectedDictionaryReferences]);

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const getData = async () => {
    setLoading(true);
    Promise.all(
      selectedDictionaryReferences?.map((c) => fetch(`${URL}/${c.reference}`))
    )
      .then((responses) =>
        Promise.all(responses?.map((response) => response.json()))
      )
      .then((res) => {
        setReference(res);
      });
    setLoading(false);
  };

  return (
    <>
      {reference?.length > 0 ? (
        <div className="table-wrapper">
          <div>
            <table>
              <thead>
                <tr>
                  <th className="variable-name table-header-DTD">
                    Variable Name
                  </th>
                  <th className="variable-description table-header-DTD">
                    Variable Description
                  </th>
                  <th className="data-type table-header-DTD">
                    Permitted Data Type
                  </th>
                  <th className="variable-summary table-header-DTD">
                    Variable Summary
                  </th>
                </tr>
              </thead>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <tbody>
                  {reference?.map((r, index) => {
                    return (
                      <TableRow
                        r={r}
                        index={index}
                        deps={{
                          codeableConceptReference,
                          setCodeableConceptReference,
                          codeableConcept,
                          setCodeableconcept,
                        }}
                      />
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
