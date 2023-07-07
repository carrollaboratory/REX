import "./variableSummary.css";
import StopSign from "../../images/stop-sign.png";

export const VariableSummaryString = ({ variableData }) => {
  return (
    <>
      {variableData ? (
        <>
          <table className="variable-summary-table-string variable-summary-table">
            <tbody>
              {variableData?.[0]?.resource?.component?.map((c) => (
                <tr key={c?.resource?.id} className="variable-summary-row">
                  <td className="empty-column"></td>
                  <span className="variable-summary-head-string variable-summary-head">
                    {" "}
                    <thead>
                      <th className="variable-summary-head-cell-string variable-summary-head-cell">
                        {c?.code?.coding?.[0]?.display}
                      </th>
                    </thead>
                  </span>
                  <td>
                    <span className="variable-summary-cell-string variable-summary-cell">
                      {c?.valueInteger}
                    </span>
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="no-data-div">
          <table className="no-data-table">
            <tbody>
              <tr key={0}>
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
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
