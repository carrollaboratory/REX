import { useContext, useEffect } from "react";
import { myContext } from "../../App";
import "./detailsNav.css";

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
