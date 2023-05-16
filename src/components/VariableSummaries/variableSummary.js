import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./variableSummary.css";
import { VariableSummaryString } from "./variableSummaryString";
import { VariableSummaryQuantity } from "./variableSummaryQuantity";

export const VariableSummary = ({ obsDefinition, height }) => {
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
    <div className={"variable-summary-wrapper"} style={height}>
      {obsDefinition?.permittedDataType?.[0] === "string" ? (
        <VariableSummaryString variableData={variableData} />
      ) : obsDefinition?.permittedDataType?.[0] === "Quantity" ? (
        <VariableSummaryQuantity variableData={variableData} />
      ) : (
        ""
      )}
    </div>
  );
};
