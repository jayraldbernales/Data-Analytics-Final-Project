import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import Charts from "./Charts";

function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Data fetch error:", err));
  }, []);

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center my-4">
        Electrical Appliances Sales Dashboard
      </h1>
      <div className="container" style={{ maxWidth: "1300px" }}>
        <div className="row mb-4">
          <div className="col-12">
            <Filters data={data} onFilter={setFilteredData} />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <Charts data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
