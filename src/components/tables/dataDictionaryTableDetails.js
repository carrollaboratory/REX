import React, { useEffect, useState } from "react";

export const DataDictionaryTableDetails = ({
  selectedDictionaryReferences,
  setDictionaryTableDetails,
  dataDictionary,
}) => {
  const [reference, setReference] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    Promise.all(
      selectedDictionaryReferences.map((c) =>
        fetch(`https://anvil-fhir-vumc.uc.r.appspot.com/fhir/${c.reference}`)
      )
    )
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((res) => {
        setReference(res);
        console.log("THERE: ", res);
      });
  };

  return (
    <>
      <button onClick={() => setDictionaryTableDetails(false)}>Back</button>
      {reference?.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Display</th>
                <th>Permitted Data Type</th>
              </tr>
            </thead>
            <tbody>
              {reference?.map((r) => {
                return (
                  <>
                    <tr>
                      <td>{r?.code?.coding?.[0]?.code}</td>
                      <td>{r?.code?.coding?.[0]?.display}</td>

                      <td>{r?.permittedDataType[0]}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
