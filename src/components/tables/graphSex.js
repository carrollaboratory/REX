import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { myContext } from "../../App";

export const GraphSex = ({ focusData }) => {
  const { selectedObject, setSelectedObject } = useContext(myContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("SET ME HERE ", focusData?.entry?.[0]?.resource);
    focusData && getData();
  }, [focusData]);
  const getData = () => {
    let graphData = [["Name", "Value"]];
    console.log("SET ME DATA ", focusData?.entry?.[0]?.resource?.component);
    focusData?.entry?.[0]?.resource?.component.map((c) => {
      if (c.valueInteger !== 0) {
        console.log("COMP:", c);
        graphData.push([c.code.coding[0].display, c.valueInteger]);
      }
    });
    setData(graphData);
    console.log("DATA: ", data);
  };

  const options = {
    title: "Sex Distribution",
  };

  const COLORS = ["#FF8F8F", "#3895D3", "#FFBB28", "#8DCC688"];

  const renderPie = () => {
    return (
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    );
  };

  return <>{data.length > 0 ? renderPie() : "No available data"}</>;
};
