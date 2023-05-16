import "./variableSummary.css";

export const VariableSummaryQuantity = ({ variableData }) => {
  return (
    <>
      {variableData ? (
        <>
          <table className="variable-summary-table">
            <thead>
              <tr>
                {variableData?.[0]?.resource?.component?.map((c, index) => (
                  <th key={index} className="variable-summary-head-q">
                    {c?.code?.coding?.[0]?.display}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {variableData?.[0]?.resource?.component?.map((c, index) => (
                  <td key={index} className="variable-summary-cell">
                    {c?.valueInteger !== undefined
                      ? c?.valueInteger
                      : c?.valueQuantity !== undefined
                      ? c?.valueQuantity?.value
                      : c?.valueRange !== undefined
                      ? `${c?.valueRange?.low?.value} - ${c?.valueRange?.high?.value}`
                      : ""}
                  </td>
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
