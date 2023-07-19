import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import {
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./details.css";
import HtmlReactParser from "html-react-parser";
import { DetailsNav } from "./detailsNav";
import { GraphSex } from "./graphSex";
import { GraphAncestry } from "./graphAncestry";
import { DetailsDataDictionary } from "./detailsDataDictionary";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";

function DetailsView() {
  const { setDetails, loading, setLoading, details, URL } =
    useContext(myContext);
  const location = useLocation();
  const [focusData, setFocusData] = useState();
  const [propData, setPropData] = useState(location?.state?.propData);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const { studyId } = useParams();

  useEffect(() => {
    setLoading(true);
    loadCriticalData();
  }, [propData]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
      navigate(null, {
        state: { propData: { ...propData } },
        replace: true,
      });
    }
  });

  const loadCriticalData = async () => {
    if (propData === undefined) {
      getSingleStudyData();
    } else {
      getGraphData();
    }
  };

  const getSingleStudyData = () => {
    return fetch(`${URL}/ResearchStudy?_id=${studyId}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPropData(data?.entry?.[0]);
        setRedirect(true);
      });
  };

  const getGraphData = () => {
    fetch(`${URL}/Observation?focus=ResearchStudy/${studyId}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        setFocusData(d);
      })
      .then(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <DetailsNav propData={propData} />

      {details ? (
        loading ? (
          <LoadingSpinner />
        ) : (
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
                  <div className="title-property">
                    {propData?.resource?.title}
                  </div>
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
                      <div>
                        {" "}
                        {HtmlReactParser(propData?.resource?.description)}
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
        )
      ) : (
        <DetailsDataDictionary propData={propData} />
      )}
    </>
  );
}

export default DetailsView;
