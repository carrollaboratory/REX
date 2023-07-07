import React, { useContext, useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner/loadingSpinner";
import "./dataDictionaryTableDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { TableRow } from "./tableRow";
import { authContext, myContext } from "../../../App";
import DownArrow from "../../../images/down_arrow.png";

export const DataDictionaryTableDetails = ({
  selectedDictionaryReferences,
  active,
}) => {
  // const [reference, setReference] = useState({});
  const [loading, setLoading] = useState(true);
  const [codeableConceptReference, setCodeableConceptReference] =
    useState(null);
  const [codeableConcept, setCodeableconcept] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [system, setSystem] = useState({});
  const [parentOpen, setParentOpen] = useState(false);

  const { studyId } = useParams();
  const { URL } = useContext(myContext);
  const { getDDTableDetails, reference } = useContext(authContext);

  const handleOpen = (open, set) => {
    set(open);
  };

  const toggleAll = () => {
    setParentOpen(!parentOpen);
  };

  useEffect(() => {
    getDDTableDetails(selectedDictionaryReferences);
  }, [selectedDictionaryReferences]);

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const getData = async () => {
    // setLoading(true);
    // Promise.all(
    //   selectedDictionaryReferences?.map((c) => fetch(`${URL}/${c.reference}`))
    // )
    //   .then((responses) =>
    //     Promise.all(responses?.map((response) => response.json()))
    //   )
    //   .then((res) => {
    //     setReference(res);
    //   });
    // setLoading(false);
  };

  return (
    <>
      {reference?.length > 0 ? (
        <div className="table-wrapper">
          <div>
            <table>
              <thead>
                <tr>
                  <th className="variable-name table-header-DTD">
                    Variable Name
                  </th>
                  <th className="variable-description table-header-DTD">
                    Variable Description
                  </th>
                  <th className="data-type table-header-DTD">
                    Permitted Data Type
                  </th>
                  <th className="variable-summary table-header-DTD">
                    <div className="variable-summary-all">
                      <div>Variable Summary</div>
                      <div>
                        <img
                          onClick={() => toggleAll()}
                          className={parentOpen ? "down-arrow" : "up-arrow"}
                          src={DownArrow}
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              {
                // loading ? (
                //   <LoadingSpinner />
                // ) :
                <tbody>
                  {reference?.map((r, index) => {
                    return (
                      <TableRow
                        r={r}
                        index={index}
                        key={index}
                        deps={{
                          codeableConceptReference,
                          setCodeableConceptReference,
                          codeableConcept,
                          setCodeableconcept,
                          handleOpen,
                          setParentOpen,
                          parentOpen,
                          active,
                        }}
                      />
                    );
                  })}
                </tbody>
              }
            </table>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
