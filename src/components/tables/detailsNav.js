import { useContext } from "react";
import { myContext } from "../../App";
import "./detailsNav.css";

export const DetailsNav = ({}) => {
  const { setDetails } = useContext(myContext);
  return (
    <>
      <div className="details-navbar">
        <button onClick={() => setDetails(true)}>Details</button>
        <button onClick={() => setDetails(false)}>Data Dictionary</button>
      </div>
    </>
  );
};
