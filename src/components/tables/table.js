import DataTable from "react-data-table-component";
import { useState, useEffect, useContext } from "react";
import "./table.css";
import HtmlReactParser from "html-react-parser";
import { myContext } from "../../App";
import { Link, useParams } from "react-router-dom";

function Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const { setSelectedObject, filterText, setFilterText, URL } =
    useContext(myContext);

  const getFilteredItems = () =>
    data?.filter(
      (item) =>
        item?.resource?.title &&
        item?.resource?.title.toLowerCase().includes(filterText.toLowerCase())
    );

  const ellipsisString = (str) => {
    if (typeof str == "string" && str.length > 115) {
      return str.slice(0, 115) + "...";
    } else {
      return str;
    }
  };

  const tableCustomStyles = {
    headRow: {
      style: {
        backgroundColor: "#F2F2F2",
        fontSize: "14px",
        // fontFamily:
        //   "-apple-system, BlinkMacSystemFont,Helvetica, Arial,sans-serif",
      },
    },
    rows: {
      style: {
        backgroundColor: "#F2F2F2",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "24px",
        padding: "5px 0px",
        color: "rgb(36, 41, 46)",
        // fontFamily:
        //   "-apple-system, BlinkMacSystemFont,Helvetica, Arial,sans-serif",
      },
      stripedStyle: {
        color: "rgb(36, 41, 46)",
        backgroundColor: "#FFFFFF",
      },
    },
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row?.resource?.title,
      wrap: true,
      width: "350px",
    },
    {
      name: "Description",
      selector: (row) =>
        row?.resource?.description === "TBD"
          ? ""
          : HtmlReactParser(ellipsisString(row.resource?.description)),
      wrap: true,
      minWidth: "300px",
    },
    {
      name: "Identifier - Value",
      selector: (row) =>
        row?.resource?.identifier[0]?.value
          ? row?.resource?.identifier[0]?.value
          : "",
      wrap: true,
    },
    {
      name: "Part Of",
      selector: (row) =>
        row?.resource?.partOf
          ? row?.resource?.partOf[0]?.reference.split("/")[1]
          : "",
      wrap: true,
      maxWidth: "fit-content",
    },
    {
      name: "Related Artifact",
      selector: (row) =>
        row?.resource?.relatedArtifact ? (
          <a href={row?.resource?.relatedArtifact[0].url} target="_blank">
            {row?.resource?.relatedArtifact[0].url}
          </a>
        ) : (
          ""
        ),
      wrap: true,
    },
    {
      name: "",
      selector: (row) => (
        <Link state={{ propData: row }} to={`/details/${row?.resource?.id}`}>
          Details
        </Link>
      ),
      maxWidth: "fit-content",
    },
  ];

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    setLoading(true);

    await fetch(`${URL}/ResearchStudy?_count=500`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data.entry);
      });
    setLoading(false);
  };

  return (
    <div className="table-wrapper">
      <div className="table">
        <div className="table-title">
          <h2>AnVIL FHIR Research Study Data</h2>
        </div>
        <div className="search-input">
          <input
            type="text"
            placeholder="Searcy by title..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <DataTable
          columns={columns}
          data={getFilteredItems(data)}
          progressPending={loading}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          // fixedHeader
          // fixedHeaderScrollHeight="650px"
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          persistTableHead
          striped={true}
          customStyles={tableCustomStyles}
        />
      </div>
    </div>
  );
}

export default Table;
