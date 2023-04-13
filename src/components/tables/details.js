import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./details.css";
import HtmlReactParser from "html-react-parser";
import { GraphSex } from "./graphSex";
import { GraphAncestry } from "./graphAncestry";

function DetailsView() {
  const { selectedObject, setSelectedObject } = useContext(myContext);
  const [focusData, setFocusData] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await fetch(
      `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/Observation?focus=ResearchStudy/${selectedObject?.resource?.id}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        setFocusData(d);
        console.log(focusData);
      });
  };

  return (
    <>
      <div
        className="details-container"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          // backgroundColor: "pink",
          justifyContent: "space-evenly",
        }}
      >
        <div
          className="details-card-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            height: "fit-content",
          }}
        >
          <div
            className="DetailsCard"
            style={{
              display: "flex",
              border: "1px solid darkgray",
              fontSize: ".8rem",
              width: "27vw",
              padding: "5px 5px 0 5px",
              flexFlow: "column wrap",
            }}
          >
            <div className="details-properties">
              <div className="title-div">Title:</div>
              <div className="title-property">
                {selectedObject?.resource?.title}
              </div>
            </div>
            <div className="details-properties">
              {selectedObject?.resource?.partOf ? (
                <>
                  <div className="title-div">Part of:</div>
                  <div>
                    {
                      selectedObject?.resource?.partOf[0]?.reference.split(
                        "/"
                      )[1]
                    }
                  </div>{" "}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="details-properties">
              {selectedObject?.resource?.relatedArtifact ? (
                <>
                  <div className="title-div">Related Artifact:</div>
                  <div>
                    {
                      <a
                        href={selectedObject?.resource?.relatedArtifact[0].url}
                        target="_blank"
                      >
                        {selectedObject?.resource?.relatedArtifact[0].label}
                      </a>
                    }
                  </div>{" "}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="details-properties">
              {selectedObject?.resource?.description === "TBD" ? (
                ""
              ) : !!selectedObject?.resource?.description ? (
                <>
                  <div className="title-div">Description:</div>
                  <div>
                    {" "}
                    {HtmlReactParser(selectedObject?.resource?.description)}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="graph-sex-display">
          <GraphSex focusData={focusData} />
        </div>
        <div className="graph-ancestry-display">
          {<GraphAncestry focusData={focusData} />}
        </div>
      </div>
      <button
        className="button"
        onClick={() => {
          setSelectedObject(null);
          navigate("/");
        }}
      >
        Back
      </button>
    </>
  );
}

export default DetailsView;
