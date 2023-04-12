import { DistributionSex } from "./distributionSex";
import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { DistributionAncestry } from "./distributionAncestry";
import { useNavigate } from "react-router-dom";
import "./details.css";
import HtmlReactParser from "html-react-parser";

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
        style={{ display: "flex", flexFlow: "row wrap" }}
      >
        <div className="details-card-wrapper">
          <div className="DetailsCard">
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
                    {/*TO DO: if relatedArtifact.url includes the partOf reference, link to the related artifact URL*/}
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
        <div
          className="graph-sex"
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "10px 10px 0 0",
            height: "fit-content",
            border: "1px solid darkgray",
            width: "27vw",
            textAlign: "center",
            fontSize: ".8rem",
            padding: "12px 0",
          }}
        >
          <b>Sex Distribution</b>
          <DistributionSex focusData={focusData} />
        </div>
        <div
          className="graph-ancestry"
          style={{
            marginTop: "10px",
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
        style={{ marginLeft: "10px" }}
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
