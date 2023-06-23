import "./variableSummary.css";
import StopSign from "../../images/stop-sign.png";

export const VariableSummaryCodeableConcept = ({ variableData }) => {
  return (
    <>
      {variableData ? (
        <>
          <table className="variable-summary-table-codeable variable-summary-table">
            {variableData?.[0]?.resource?.component?.map((c) => (
              <tr key={c?.resource?.id}>
                <td className="empty-column"></td>

                <div className="variable-summary-head-codeable variable-summary-head">
                  {" "}
                  <thead>
                    <th className="variable-summary-head-cell-codeable variable-summary-head-cell">
                      {c?.code?.coding?.[0]?.display}
                    </th>
                  </thead>
                </div>
                <td>
                  <div className="variable-summary-cell-codeable variable-summary-cell">
                    {c?.valueInteger}
                  </div>
                </td>
              </tr>
            ))}
          </table>
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
