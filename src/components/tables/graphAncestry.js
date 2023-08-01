import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { myContext } from "../../App";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";

export const GraphAncestry = ({ focusData }) => {
  const { loading } = useContext(myContext);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    focusData && getData();
  }, [focusData]);

  const navigate = useNavigate();

  const colors = [
    "#55ebd8", //aqua
    "#80c587", //green
    "#E84B57", //red
    "#3D85BC", //blue
    "#FFEE6A", //yellow
    "#32393F", //black
    "#FFBB28", //orange
    "#A579EF", //purple
    "#ADB5BD", //grey
  ];

  const getData = () => {
    let graphData = [["Ancestry", "Value", { role: "style" }]];
    focusData?.entry?.map((c) => {
      if (c?.resource?.valueCodeableConcept?.coding?.[0]?.code === "ancestry") {
        c?.resource?.component?.map((r, index) => {
          if (r?.valueInteger !== 0) {
            graphData.push([
              r?.code?.coding?.[0]?.display,
              r?.valueInteger,
              colors[index % colors.length],
            ]);
            setShow(true);
          }
        });
      }
    });
    setData(graphData);
  };

  const options = {
    legend: { position: "none" },
  };

  //Function to render the graph

  const renderBar = () => {
    return (
      <div className="graph-display">
        <Chart
          chartType="ColumnChart"
          data={data}
          options={options}
          width={"100%"}
          height={"250px"}
          loader={<div>Loading...</div>}
        />
      </div>
    );
  };

  let sum = 0;
  focusData?.entry?.map((c) => {
    if (c?.resource?.valueCodeableConcept?.coding?.[0]?.code === "ancestry") {
      c?.resource?.component?.forEach((d) => (sum += d?.valueInteger));
    }
  });

  return (
    <>
      <div>
        <div className="graph-ancestry">
          {focusData?.entry?.map((c) => {
            if (
              c?.resource?.valueCodeableConcept?.coding?.[0]?.code ===
              "ancestry"
            ) {
              return (
                <>
                  <div key={c?.resource?.id}>
                    <b>
                      {c?.resource?.valueCodeableConcept?.coding?.[0]?.display}
                    </b>
                  </div>
                  <div>Total: {sum}</div>

                  <div className="distribution-ancestry-wrapper">
                    {c?.resource?.component
                      ? c?.resource?.component?.map((c, index) => {
                          if (c.valueInteger !== 0) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className="distribution-ancestry"
                                >
                                  <div className="display-wrapper">
                                    <div className="display">
                                      {c?.code?.coding[0]?.display}
                                    </div>
                                    <div className="value-integer">
                                      {c?.valueInteger}
                                    </div>
                                  </div>
                                  {/*Legend for graph*/}
                                  <div
                                    className="legend"
                                    style={{
                                      background: colors[index % colors.length],
                                    }}
                                  ></div>
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
          {/*Bar graph is rendered if there is data available*/}
          {loading ? (
            <LoadingSpinner />
          ) : show ? (
            renderBar()
          ) : (
            <>
              <div>No available data</div>
            </>
          )}
        </div>
        <button
          className="button"
          onClick={() => {
            // setSelectedObject(null);
            navigate("/");
          }}
        >
          Back
        </button>
      </div>
    </>
  );
};
