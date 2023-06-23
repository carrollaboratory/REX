import "./variableSummary.css";
import StopSign from "../../images/stop-sign.png";

export const VariableSummaryQuantity = ({ variableData }) => {
  return (
    <>
      {variableData ? (
        <>
          <table className="variable-summary-table-quantity variable-summary-table">
            {variableData?.[0]?.resource?.component?.map((c) => (
              <tr key={c?.resource?.id}>
                <td className="empty-column"></td>

                <div className="variable-summary-head-quantity variable-summary-head">
                  {" "}
                  <thead>
                    <th className="variable-summary-head-cell-quantity variable-summary-head-cell">
                      {c?.code?.coding?.[0]?.display}
                    </th>
                  </thead>
                </div>
                <td>
                  <div className="variable-summary-cell-quantity variable-summary-cell">
                    {c?.valueInteger !== undefined
                      ? c?.valueInteger
                      : c?.valueQuantity !== undefined
                      ? c?.valueQuantity?.value
                      : c?.valueRange !== undefined
                      ? `${c?.valueRange?.low?.value} - ${c?.valueRange?.high?.value}`
                      : ""}
                  </div>
                </td>
              </tr>
            ))}
          </table>
          ;
        </>
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
    </>
  );
};
