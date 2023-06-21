import { useEffect, useRef, useState } from "react";
import { VariableSummary } from "../../VariableSummaries/variableSummary";
import "./dataDictionaryTableDetails.css";
import { CodeableConcept } from "../codeableConcept";
import DownArrow from "../../../images/down_arrow.png";

export const TableRow = ({ r, index, deps }) => {
  const {
    codeableConceptReference,
    setCodeableConceptReference,
    setCodeableconcept,
    handleOpen,
    parentOpen,
    setParentOpen,
    active,
  } = deps;
  const [height, setHeight] = useState(null);
  const [open, setSingleOpen] = useState(false);
  const subRowRef = useRef(null);

  useEffect(() => {
    setHeight(subRowRef?.current?.clientHeight);
  });

  useEffect(() => {
    setSingleOpen(false);
    setParentOpen(false);
  }, [active]);

  useEffect(() => {
    setSingleOpen(parentOpen);
  }, [parentOpen]);

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  return (
    <>
      <tr key={r?.id} className="colored-row">
        <td className="variable-name table-cell-DTD">
          {r?.code?.coding?.[0]?.code}
        </td>
        <td className="variable-description table-cell-DTD">
          {r?.code?.coding?.[0]?.display}
        </td>
        <td className="data-type table-cell-DTD codeable-concept-style">
          {r?.permittedDataType[0] === "CodeableConcept" ? (
            <>
              <div
                className="codeableConceptLink"
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleCodeableConceptClick(r?.validCodedValueSet?.reference);
                }}
              >
                {r?.permittedDataType[0]}
              </div>
              <div>
                <CodeableConcept
                  className={
                    r?.validCodedValueSet?.reference ===
                    codeableConceptReference
                      ? "codeableConcept"
                      : "codeableConcept--closed"
                  }
                  isOpen={
                    r?.validCodedValueSet?.reference ===
                    codeableConceptReference
                  }
                  toggleModal={setCodeableConceptReference}
                  codeableConceptReference={codeableConceptReference}
                />
              </div>
            </>
          ) : (
            r?.permittedDataType[0]
          )}
        </td>
        <td className="table-cell-DTD">
          <div
            className="variable-summary-arrow"
            onClick={() => handleOpen(!open, setSingleOpen)}
          >
            <img className={open ? "down-arrow" : "up-arrow"} src={DownArrow} />
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan="3">
          <div
            className={open ? "sub-row--open" : "sub-row--closed"}
            ref={subRowRef}
          >
            <VariableSummary obsDefinition={r} />
          </div>
        </td>
      </tr>
    </>
  );
};
