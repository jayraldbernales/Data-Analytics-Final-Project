import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Charts({ data }) {
  if (data.length === 0)
    return (
      <div className="alert alert-info text-center p-4">
        No data matches filters.
      </div>
    );

  const totalSales = data.reduce((sum, d) => sum + d.Sales, 0);
  const totalProfit = data.reduce((sum, d) => sum + d.Profit, 0);
  const avgMargin = ((totalProfit / totalSales) * 100).toFixed(1);

  const regionData = data.reduce((acc, d) => {
    acc[d.Region] = acc[d.Region] || { sales: 0, profit: 0 };
    acc[d.Region].sales += d.Sales;
    acc[d.Region].profit += d.Profit;
    return acc;
  }, {});

  const regionLabels = Object.keys(regionData);
  const regionSales = regionLabels.map((r) => regionData[r].sales / 1e6);
  const regionProfits = regionLabels.map((r) => regionData[r].profit / 1e6);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.1)" } } },
  };

  const barData = {
    labels: regionLabels,
    datasets: [
      {
        label: "Sales ($M)",
        data: regionSales,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Profit ($M)",
        data: regionProfits,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const productSales = data.reduce((acc, d) => {
    acc[d["Product Name"]] = (acc[d["Product Name"]] || 0) + d.Sales;
    return acc;
  }, {});
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const pieLabels = topProducts.map(([p]) => p); // Full names—no truncation

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 20, usePointStyle: true, font: { size: 10 } },
      }, // Bottom for space, smaller font for long names
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: $${ctx.parsed.toLocaleString()}`,
        },
      }, // Full name in tooltip
    },
  };
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: topProducts.map(([, s]) => s),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const timeData = data.reduce((acc, d) => {
    const month = new Date(d["Order Date"]).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + d.Profit;
    return acc;
  }, {});
  const timeLabels = Object.keys(timeData).sort();
  const timeProfits = timeLabels.map((m) => timeData[m]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxRotation: 45 } },
      y: { grid: { color: "rgba(0,0,0,0.1)" } },
    },
  };
  const lineData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Profit ($)",
        data: timeProfits,
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="mb-4">
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow border-start border-primary border-4 h-100">
            <div className="card-body text-center p-3">
              <h6 className="fw-bold text-primary mb-1">Total Sales</h6>
              <p className="h4 mb-0 text-primary">
                ${totalSales.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow border-start border-success border-4 h-100">
            <div className="card-body text-center p-3">
              <h6 className="fw-bold text-success mb-1">Total Profit</h6>
              <p className="h4 mb-0 text-success">
                ${totalProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow border-start border-info border-4 h-100">
            <div className="card-body text-center p-3">
              <h6 className="fw-bold text-info mb-1">Avg Margin</h6>
              <p className="h4 mb-0 text-info">{avgMargin}%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card shadow h-100">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0 text-primary">
                Insight 1: Sales/Profit by Region
              </h6>
            </div>
            <div className="card-body p-2" style={{ height: "400px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow h-100">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0 text-success">
                Insight 2: Top 5 Products
              </h6>
            </div>
            <div className="card-body p-2" style={{ height: "400px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0 text-info">
                Insight 3: Profit Over Time
              </h6>
            </div>
            <div className="card-body p-2" style={{ height: "400px" }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
