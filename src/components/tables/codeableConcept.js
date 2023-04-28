import { useEffect, useState } from "react";
import "./codeableConcept.css";
import LoadingSpinner from "../LoadingSpinner/loadingSpinner";

export const CodeableConcept = ({ toggleModal, codeableConceptReference }) => {
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch(
      `https:/anvil-fhir-vumc.uc.r.appspot.com/fhir/${codeableConceptReference}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/CodeSystem?url=${d?.compose?.include[0]?.system}`,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((m) => {
            setModalData(m);
          });
      });
  };

  return (
    <div className="modal">
      {modalData ? (
        <>
          <div className="modal-content">
            <span className="close" onClick={() => toggleModal(false)}>
              &times;
            </span>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData?.entry?.[0]?.resource?.concept?.map((c, index) => (
                    <tr key={index} className="item">
                      <td>{c.display}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};
