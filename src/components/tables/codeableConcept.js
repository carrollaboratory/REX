import { useContext, useEffect, useState } from "react";
import "./codeableConcept.css";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";
import { myContext } from "../../App";

export const CodeableConcept = ({
  toggleModal,
  codeableConceptReference,
  isOpen,
  ...props
}) => {
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);
  const { URL } = useContext(myContext);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getData();
    }
  }, [codeableConceptReference]);
  const getData = () => {
    const codeableConceptEndpoint = `${URL}/${codeableConceptReference}`;

    fetch(codeableConceptEndpoint, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        const codeSystemEndpoint =
          `${URL}/CodeSystem?url=` + d?.compose?.include[0]?.system;

        fetch(codeSystemEndpoint, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((m) => {
            setModalData(m);
            setLoading(false);
          });
      });
  };

  return (
    <div className="modal" {...props}>
      <div className="modal-content">
        {loading ? (
          <LoadingSpinner className="modalSpinner" />
        ) : (
          <>
            <span className="close" onClick={() => toggleModal(null)}>
              &times;
            </span>
            <div>
              <table>
                <thead>
                  <tr>
                    <th className="codeable-concept-head">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData?.entry?.[0]?.resource?.concept?.map((c, index) => (
                    <tr key={index} className="item-codeable-concept">
                      <td className="codeable-concept-cell">{c.display}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
