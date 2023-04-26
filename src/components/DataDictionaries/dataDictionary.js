import { useContext, useEffect, useState } from "react";
import "./dataDictionary.css";
import DataTable from "react-data-table-component";
import { myContext } from "../../App";
import { Link } from "react-router-dom";

function DataDictionary() {
  const [titleData, setTitleData] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { filterText, setFilterText } = useContext(myContext);

  const getFilteredItems = () =>
    titleData?.filter(
      (item) =>
        item?.resource?.title &&
        item?.resource?.title.toLowerCase().includes(filterText.toLowerCase())
    );

  const tableCustomStyles = {
    headRow: {
      style: {
        backgroundColor: "#E7EEF0",
      },
    },
    rows: {
      style: {
        backgroundColor: "#E7EEF0",
      },
      stripedStyle: {
        color: "#000000",
        backgroundColor: "#FFFFFF",
      },
    },
  };

  const columns = [
    {
      name: "Data Dictionary",
      selector: (row) => (
        <Link
          state={{
            selectedDictionaryReferences: row?.resource,
          }}
          to={`/dataDictionary/${row?.resource?.title?.split(" ").pop()}`}
        >
          {row?.resource?.title}
        </Link>
      ),
      wrap: true,
    },
  ];

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = () => {
    setLoading(true);
    fetch("https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((c) => {
        setTitleData(c.entry);
      });
    setLoading(false);
  };

  // const getReferences = async () => {
  //   Array.isArray(titleData)
  //     ? Promise.all(
  //         titleData?.map((d) =>
  //           d.resource.observationResultRequirement.map((r) => {
  //             return fetch(
  //               `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/${r.reference}`,
  //               {
  //                 method: "GET",
  //               }
  //             );
  //           })
  //         )
  //       )
  //     : null
  //         .then((responses) => {
  //           Promise.all(responses.map((response) => response.json()));
  //         })
  //         .then((m) => {
  //           setData(m);
  //         });
  // };

  return (
    <div className="table-wrapper">
      <div className="table">
        <div className="table-title">
          <h4>Data Dictionaries</h4>
        </div>
        <div className="search-input-dd">
          <input
            type="text"
            placeholder="Searcy by value..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <DataTable
          columns={columns}
          data={getFilteredItems(titleData)}
          progressPending={loading}
          fixedHeader
          striped={true}
          customStyles={tableCustomStyles}
        />
      </div>
    </div>
  );
}

export default DataDictionary;
