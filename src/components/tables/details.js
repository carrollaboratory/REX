import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { DistributionAncestry } from "./distributionAncestry";
import { useNavigate } from "react-router-dom";
import "./details.css";
import HtmlReactParser from "html-react-parser";
import { GraphSex } from "./graphSex";

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
              <div
                className="title-div"
                style={{
                  fontWeight: "bold",
                  marginRight: "5px",
                  fontSize: ".7rem",
                  minWidth: "70px",
                  maxWidth: "70px",
                }}
              >
                Title:
              </div>
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
        <div
          className="graph-ancestry"
          style={{
            height: "fit-content",
            width: "42vw",
            border: "1px solid darkgray",
            textAlign: "center",
            fontSize: ".8rem",
            padding: "12px 0",
          }}
        >
          <b>Ancestry Distribution</b>

          {<DistributionAncestry focusData={focusData} />}
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
