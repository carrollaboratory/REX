import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { myContext } from "../../App";

export const GraphSex = ({ focusData }) => {
  const { selectedObject, setSelectedObject } = useContext(myContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    focusData && getData();
  }, [focusData]);

  const getData = () => {
    let graphData = [["Name", "Value"]];
    focusData?.entry?.[0]?.resource?.component.map((c) => {
      if (c.valueInteger !== 0) {
        graphData.push([c.code.coding[0].display, c.valueInteger]);
      }
    });
    setData(graphData);
  };

  const options = {
    colors: ["#FF8F8F", "#3895D3", "#FFBB28", "#8DCC688"],
    legend: "bottom",
  };

  const renderPie = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"99%"}
          height={"250px"}
        />
      </div>
    );
  };

  let sum = 0;
  focusData?.entry?.[0]?.resource?.component.forEach(
    (d) => (sum += d.valueInteger)
  );

  return (
    <>
      <div
        className="graph-sex"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "fit-content",
          border: "1px solid darkgray",
          width: "27vw",
          textAlign: "center",
          fontSize: ".8rem",
          padding: "12px 0",
        }}
      >
        <b>Sex Distribution</b>
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
            : ""}
        </div>

        {data.length > 0 ? renderPie() : "No available data"}
      </div>
    </>
  );
};
