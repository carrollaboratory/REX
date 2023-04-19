import { useContext } from "react";
import { myContext } from "../../App";

export const DetailsNav = ({}) => {
  const { setDetails } = useContext(myContext);
  return (
    <>
      <button onClick={() => setDetails(true)}>Details</button>
      <button onClick={() => setDetails(false)}>Data Dictionary</button>
    </>
  );
};
