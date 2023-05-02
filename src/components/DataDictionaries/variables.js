import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { CodeableConcept } from "../tables/codeableConcept";

export const Variables = () => {
  const { filterText, setFilterText } = useContext(myContext);
  const [observationData, setObservationData] = useState([]);
  const [codeableConceptReference, setCodeableConceptReference] = useState({});
  const [codeableConcept, setCodeableconcept] = useState(false);

  const handleCodeableConceptClick = (item) => {
    setCodeableConceptReference(item);
    setCodeableconcept(true);
  };

  const getFilteredItems = () => {
    if (!!filterText) {
      return observationData?.filter(
        (item) =>
          item?.resource?.code?.text &&
          item?.resource?.code?.text
            .toLowerCase()
            .includes(filterText.toLowerCase())
      );
    } else {
      return observationData;
    }
  };

  useEffect(() => {
    fetchObservationDefinitions();
  }, []);

  const fetchObservationDefinitions = () => {
    filterText != ""
      ? fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ObservationDefinition?code:text=${filterText}`,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            setObservationData(c.entry);
          })
      : fetch(
          "https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition?_include=ActivityDefinition:result",
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            setObservationData(c.entry);
          });
  };

  return (
    <>
      <div className="search-input-dd">
        <input
          id="inputText"
          type="text"
          placeholder="Search by value..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {getFilteredItems().length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="dd-variable-name">Variable Name</th>
              <th className="dd-variable-description">Variable Description</th>
              <th className="dd-data-type">Permitted Data Type</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredItems()?.map((r, index) =>
              r.resource.resourceType === "ObservationDefinition" ? (
                <>
                  <tr key={index}>
                    <td key={index}>{r?.resource?.code?.coding?.[0]?.code}</td>
                    <td>{r?.resource?.code?.coding?.[0]?.display}</td>
                    <td>
                      {r?.resource?.permittedDataType[0] ===
                      "CodeableConcept" ? (
                        <div
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleCodeableConceptClick(
                              r?.resource?.validCodedValueSet?.reference
                            );
                          }}
                        >
                          {r?.resource?.permittedDataType[0]}
                        </div>
                      ) : (
                        r?.resource?.permittedDataType[0]
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                ""
              )
            )}
          </tbody>
        </table>
      ) : (
        "No results found"
      )}
      {codeableConcept && (
        <CodeableConcept
          toggleModal={setCodeableconcept}
          codeableConceptReference={codeableConceptReference}
        />
      )}
    </>
  );
};
