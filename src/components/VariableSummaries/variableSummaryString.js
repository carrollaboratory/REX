import "./variableSummary.css";

export const VariableSummaryString = ({ variableData }) => {
  return (
    <>
      {variableData ? (
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
      )}
    </>
  );
};
