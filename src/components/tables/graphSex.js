import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { myContext } from "../../App";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";

export const GraphSex = ({ focusData }) => {
  const { loading } = useContext(myContext);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    focusData && getData();
  }, [focusData]);

  const getData = () => {
    let graphData = [["Sex", "Value"]];

    focusData?.entry?.map((c) => {
      if (c?.resource?.valueCodeableConcept?.coding?.[0]?.code === "sex") {
        c?.resource?.component?.map((r, index) => {
          if (r?.valueInteger !== 0) {
            graphData.push([r?.code?.coding?.[0]?.display, r?.valueInteger]);
            setShow(true);
          }
        });
      }
    });
    setData(graphData);
  };

  const color = ["FF8F8F", "3895D3", "8DCC68", "FFBB28", "ADB5BD"];

  // const customColors = () => {
  //   let graphColor = [];
  //   focusData?.entry?.[0]?.resource?.component?.forEach((c, index) => {
  //     if (c.valueInteger !== 0) {
  //       graphColor.push(colors[c.code.coding[0].display]);
  //     }
  //   });
  //   return graphColor;
  // };

  const options = {
    legend: "bottom",
    pieStartAngle: 180,
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
          options={{ colors: color, ...options }}
          width={"99%"}
          height={"250px"}
        />
      </div>
    );
  };

  let sum = 0;
  focusData?.entry?.map((c) => {
    if (c?.resource?.valueCodeableConcept?.coding?.[0]?.code === "sex") {
      c?.resource?.component?.forEach((d) => (sum += d?.valueInteger));
    }
  });

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
        {focusData?.entry?.map((c, index) => {
          if (c?.resource?.valueCodeableConcept?.coding?.[0]?.code === "sex") {
            return (
              <>
                <div>
                  <b>
                    {c?.resource?.valueCodeableConcept?.coding?.[0]?.display}
                  </b>
                </div>
                <div>Total: {sum}</div>
                <div
                  className="container"
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
                  {c?.resource?.component
                    ? c?.resource?.component?.map((c, index) => {
                        if (c.valueInteger !== 0) {
                          return (
                            <>
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div>{}</div>
                                <div className="display">
                                  {c.code?.coding[0]?.display}
                                </div>
                                <div className="value-integer">
                                  {c.valueInteger}
                                </div>
                              </div>
                            </>
                          );
                        }
                      })
                    : ""}
                </div>
              </>
            );
          }
        })}

        {loading ? (
          <LoadingSpinner />
        ) : show ? (
          renderPie()
        ) : (
          "No available data"
        )}
      </div>
    </>
  );
};
