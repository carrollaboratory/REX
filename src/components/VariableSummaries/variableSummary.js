import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./variableSummary.css";
import { VariableSummaryString } from "./variableSummaryString";
import { VariableSummaryQuantity } from "./variableSummaryQuantity";
import { VariableSummaryCodeableConcept } from "./variableSummaryCodeableConcept";
import { myContext } from "../AppFHIR";
import StopSign from "../../images/stop-sign.png";

export const VariableSummary = ({ obsDefinition, height }) => {
  const { studyId } = useParams();
  const variableData = obsDefinition?.detail;
  const { URL } = useContext(myContext);

  return obsDefinition ? (
    <div className={"variable-summary-wrapper"} style={height}>
      {obsDefinition?.permittedDataType?.[0] === "string" ? (
        <VariableSummaryString variableData={variableData} />
      ) : obsDefinition?.permittedDataType?.[0] === "Quantity" ? (
        <VariableSummaryQuantity variableData={variableData} />
      ) : obsDefinition?.permittedDataType?.[0] === "CodeableConcept" ? (
        <VariableSummaryCodeableConcept variableData={variableData} />
      ) : (
        <div className="no-data-div">
          <table className="no-data-table">
            <tr>
              <td className="empty-column"></td>
              <td className="no-data-cell">
                <div>
                  <img
                    src={StopSign}
                    className="stop-sign"
                    alt="Stop sign icon"
                  />
                </div>
                <div>No data found.</div>
              </td>
            </tr>
          </table>
        </div>
      )}
    </div>
  ) : (
    ""
  );
};
