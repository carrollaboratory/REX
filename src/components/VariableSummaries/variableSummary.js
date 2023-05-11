import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./variableSummary.css";

export const VariableSummary = ({ obsDefinition }) => {
  const { studyId } = useParams();
  const [variableData, setVariableData] = useState({});

  useEffect(() => {
    getVariableData();
  }, [obsDefinition]);

  const getVariableData = async () => {
    await fetch(
      `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/Observation?value-concept=${obsDefinition?.code?.coding?.[0]?.system}|${obsDefinition?.code?.coding?.[0]?.code}&focus=ResearchStudy/${studyId} `,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setVariableData(data.entry);
      });
  };

  return (
    <div className="variable-summary-wrapper">
      {obsDefinition?.permittedDataType?.[0] === "string" ? (
        variableData ? (
          <>
            <table className="variable-summary-table">
              <thead>
                <tr>
                  {variableData?.[0]?.resource?.component?.map((c, index) => (
                    <th key={index} className="variable-summary-head">
                      {c?.code?.coding?.[0]?.display}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {variableData?.[0]?.resource?.component?.map((c) => (
                    <td className="variable-summary-cell">{c?.valueInteger}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <div className="no-data">No data found</div>
        )
      ) : (
        ""
      )}
    </div>
  );
};
