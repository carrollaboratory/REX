import { useContext, useEffect, useState } from "react";
import "./dataDictionary.css";
import { myContext } from "../../App";
import { Link } from "react-router-dom";
import { Variables } from "./variables";

function DataDictionary() {
  const [titleData, setTitleData] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { filterText, setFilterText, dDView, setDDView } =
    useContext(myContext);

  useEffect(() => {
    getTableData();
  }, []);

  const capitalizeWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getTableData = () => {
    filterText != ""
      ? fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ObservationDefinition?code:text=${filterText}&_revinclude=ActivityDefinition:result`,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            setTitleData(c.entry);
          })
      : fetch(
          "https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition",
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            setTitleData(c.entry);
          });
  };

  return (
    <>
      <div className="dd-table-wrapper">
        <div className="table">
          <div className="dd-title">
            <h4
              className="dd-nav-header"
              onClick={() => {
                setDDView(true);
                window.history.replaceState("", "", "/dataDictionary");
              }}
            >
              Data Dictionaries
            </h4>
            <h4
              className="dd-nav-header"
              onClick={() => {
                setDDView(false);
                window.history.replaceState("", "", "/variables");
              }}
            >
              Variables
            </h4>
          </div>
          {dDView ? (
            <>
              <div className="search-input-dd">
                <input
                  id="inputText"
                  type="text"
                  placeholder="Search by value..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />

                <button
                  className="search-button"
                  onClick={(e) => getTableData()}
                >
                  Search
                </button>

                <form>
                  <button
                    className="clear-button"
                    onClick={() => setFilterText("")}
                  >
                    X
                  </button>
                </form>
              </div>
              {titleData?.length > 0 ? (
                <table className="dd-table">
                  <thead>
                    <tr>
                      <th className="dd-name table-head-DD">
                        Variables for Data Dictionary
                      </th>
                      <th className="dd-table-name table-head-DD">Table</th>
                      <th className="dd-table-name table-head-DD"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {titleData?.map((r, index) => {
                      return (
                        <>
                          {r?.resource?.title ? (
                            <tr key={index}>
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
          ) : (
            <Variables capitalizeWord={capitalizeWord} />
          )}
        </div>
      </div>
    </>
  );
}

export default DataDictionary;
