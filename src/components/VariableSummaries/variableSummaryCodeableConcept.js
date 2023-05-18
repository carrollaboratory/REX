import "./variableSummary.css";

export const VariableSummaryCodeableConcept = ({ variableData }) => {
  return (
    <>
      {variableData ? (
        <>
          <table className="variable-summary-table-codeable">
            {variableData?.[0]?.resource?.component?.map((c) => (
              <tr key={c?.resource?.id}>
                <div className="variable-summary-head-codeable">
                  {" "}
                  <thead>
                    <th className="variable-summary-head-cell-codeable">
                      {c?.code?.coding?.[0]?.display}
                    </th>
                  </thead>
                </div>
                <td>
                  <div className="variable-summary-cell-codeable">
                    {c?.valueInteger}
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </>
      ) : (
        <div className="no-data">No data found</div>
      )}
    </>
  );
};
