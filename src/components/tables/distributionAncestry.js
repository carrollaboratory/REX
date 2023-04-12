import { GraphSex } from "./graphSex";

export const DistributionAncestry = ({ focusData }) => {
  let sum = 0;
  focusData?.entry?.[1]?.resource?.component.forEach(
    (d) => (sum += d.valueInteger)
  );

  return (
    <>
      {focusData?.entry?.[1]?.resource?.component ? (
        <div>Total: {sum}</div>
      ) : (
        ""
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          padding: "5px",
          fontSize: ".8rem",
          margin: "9px",
        }}
      >
        {focusData?.entry?.[1]?.resource?.component
          ? focusData?.entry?.[1]?.resource?.component.map((c, index) => {
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
            })
          : "No available data"}
      </div>
    </>
  );
};
