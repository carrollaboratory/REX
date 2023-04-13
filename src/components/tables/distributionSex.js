import { GraphSex } from "./graphSex";

export const DistributionSex = ({ focusData }) => {
  let sum = 0;
  focusData?.entry?.[0]?.resource?.component.forEach(
    (d) => (sum += d.valueInteger)
  );
  console.log("FOCUS MID: ", focusData);
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
          flexFlow: "row wrap",
          justifyContent: "space-evenly",
          padding: "5px",
          fontSize: ".8rem",
          margin: "9px",
          overflowWrap: "break-word",
        }}
      >
        {focusData?.entry?.[0]?.resource?.component
          ? focusData?.entry?.[0]?.resource?.component.map((c, index) => {
              if (c.valueInteger !== 0) {
                return (
                  <>
                    <div
                      key={index}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div>{}</div>
                      <div className="display">
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
