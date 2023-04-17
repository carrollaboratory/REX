import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./details.css";
import HtmlReactParser from "html-react-parser";
import { GraphSex } from "./graphSex";
import { GraphAncestry } from "./graphAncestry";

function DetailsView() {
  // const { selectedObject, setSelectedObject } = useContext(myContext);
  const [focusData, setFocusData] = useState();
  const navigate = useNavigate();
  const { studyId } = useParams();
  const location = useLocation();
  const { propData } = location.state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const getData = async () => {
    await fetch(
      `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/Observation?focus=ResearchStudy/${studyId}`,
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
    setLoading(false);
  };

  return (
    <>
      <div
        className="details-container"
        style={{
          display: "flex",
          flexFlow: "row wrap",
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
              <div className="title-property">{propData?.resource?.title}</div>
            </div>
            <div className="details-properties">
              {propData?.resource?.partOf ? (
                <>
                  <div className="title-div">Part of:</div>
                  <div>
                    {propData?.resource?.partOf[0]?.reference.split("/")[1]}
                  </div>{" "}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="details-properties">
              {propData?.resource?.relatedArtifact ? (
                <>
                  <div className="title-div">Related Artifact:</div>
                  <div>
                    {
                      <a
                        href={propData?.resource?.relatedArtifact[0].url}
                        target="_blank"
                      >
                        {propData?.resource?.relatedArtifact[0].label}
                      </a>
                    }
                  </div>{" "}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="details-properties">
              {propData?.resource?.description === "TBD" ? (
                ""
              ) : !!propData?.resource?.description ? (
                <>
                  <div className="title-div">Description:</div>
                  <div> {HtmlReactParser(propData?.resource?.description)}</div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="graph-sex-display">
          <GraphSex focusData={focusData} loading={loading} />
        </div>
        <div className="graph-ancestry-display">
          {<GraphAncestry focusData={focusData} loading={loading} />}
        </div>
      </div>
    </>
  );
}

export default DetailsView;
