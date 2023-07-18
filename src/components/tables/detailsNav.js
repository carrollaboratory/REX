import { useContext, useEffect } from "react";
import { myContext } from "../../App";
import "./detailsNav.css";
import { useParams } from "react-router-dom";

export const DetailsNav = ({}) => {
  const { setDetails, studyId } = useContext(myContext);

  useEffect(() => {
    setDetails(true);
  }, [studyId]);

  return (
    <>
      <div className="details-navbar">
        <button className="details-nav-button" onClick={() => setDetails(true)}>
          Details
        </button>
        <button
          className="details-nav-button"
          onClick={() => setDetails(false)}
        >
          Data Dictionary
        </button>
      </div>
    </>
  );
};
