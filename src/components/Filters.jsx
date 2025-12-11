import React, { useState, useEffect } from "react";

function Filters({ data, onFilter }) {
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    let filtered = data;

    if (region) filtered = filtered.filter((d) => d.Region === region);
    if (category)
      filtered = filtered.filter((d) => d["Product Category"] === category);
    if (selectedYear !== "all") {
      const start = new Date(`${selectedYear}-01-01`);
      const end = new Date(`${selectedYear}-12-31`);
      filtered = filtered.filter(
        (d) =>
          new Date(d["Order Date"]) >= start && new Date(d["Order Date"]) <= end
      );
    }

    onFilter(filtered);
  }, [region, category, selectedYear, data, onFilter]);

  const regions = [...new Set(data.map((d) => d.Region))];
  const categories = [...new Set(data.map((d) => d["Product Category"]))];

  return (
    <div className="card shadow p-4 mb-4">
      <h4 className="fw-bold mb-4 text-primary"> Filters</h4>

      {/* FILTER ROW */}
      <div className="row g-3">
        {/* REGION FILTER */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Region</label>
          <select
            className="form-select form-select-lg"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORY FILTER */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Product Category</label>
          <select
            className="form-select form-select-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* YEAR FILTER */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold mb-2">Year</label>

          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn ${
                selectedYear === "all"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              } btn-lg`}
              onClick={() => setSelectedYear("all")}
            >
              All
            </button>

            {[2016, 2017, 2018, 2019].map((y) => (
              <button
                key={y}
                className={`btn ${
                  selectedYear === y.toString()
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                } btn-lg`}
                onClick={() => setSelectedYear(y.toString())}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
