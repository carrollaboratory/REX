export const DistributionAncestry = ({ focusData }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          //   width: "400px",
          justifyContent: "space-evenly",
          padding: "5px",
          fontSize: ".8rem",
          margin: "9px",
        }}
      >
        {focusData?.entry?.[1]?.resource?.component.map((c, index) => {
          if (c.valueInteger !== 0) {
            return (
              <>
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    className="display"
                    style={{
                      display: "flex",
                      flexFlow: "column wrap",
                      width: "60px",
                    }}
                  >
                    {c.code?.coding[0]?.display}
                  </div>
                  <div className="value-integer">{c.valueInteger}</div>
                </div>
              </>
            );
          }
        })}
      </div>
    </>
  );
};
