import { useContext, useEffect, useState } from "react";
import "./dataDictionary.css";
import { authContext, myContext } from "../../App";
import { Link } from "react-router-dom";
import { Variables } from "./variables";
import { capitalizeWord } from "./utilities";
import { SearchBar } from "./searchBar";

function DataDictionary() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { dDView, setDDView, URL } = useContext(myContext);
  const {
    filterText,
    setFilterText,
    getDataDictionary,
    activityData,
    getVariables,
  } = useContext(authContext);

  useEffect(() => {
    getVariables();
  }, []);

  return (
    <>
      <SearchBar>
        <>
          {activityData?.length > 0 ? (
            <table className="dd-table">
              <thead className="data-dictionary-table-head">
                <tr>
                  <th className="dd-name table-head-DD">
                    Variables for Data Dictionary
                  </th>
                  <th className="dd-table-name table-head-DD">Table</th>
                  <th className="dd-table-name table-head-DD"></th>
                </tr>
              </thead>
              <tbody>
                {activityData?.map((r, index) => {
                  return (
                    <>
                      {r?.resource?.title ? (
                        <tr key={index} className="DD-colored-row">
                          <td className="dd-variable-name table-cell-DD">
                            {r?.resource?.title.split(" ")[3].split("_")[0]}
                          </td>
                          <td className="dd-variable-name table-cell-DD">
                            {capitalizeWord(
                              r?.resource?.title.split(".").pop()
                            )}
                          </td>
                          <td className="dd-variable-name table-cell-DD">
                            <Link
                              state={{
                                selectedDictionaryReferences: r?.resource,
                              }}
                              to={`/dataDictionary/${r?.resource?.id}`}
                            >
                              Inspect
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="no-results">No results found.</div>
          )}{" "}
        </>
      </SearchBar>
    </>
  );
}

export default DataDictionary;
