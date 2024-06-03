import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "./SparklineChart.scss";

const SparklineChart = () => {
  const [filter, setFilter] = useState("weekly");

  const weeklyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Cost",
        data: [1000, 1500, 1200, 1800],
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        pointRadius: 0, // Remove dots on points
        tension: 0.4, // Smooth lines
      },
    ],
  };

  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Cost",
        data: [2000, 2500, 2200, 2800],
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        pointRadius: 0, // Remove dots on points
        tension: 0.4, // Smooth lines
      },
    ],
  };

  const data = filter === "weekly" ? weeklyData : monthlyData;

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cost ($)",
        },
        ticks: {
          callback: function (value) {
            return `${value / 1000}k`;
          },
          stepSize: 5000,
          min: 0,
          max: 10000,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="sparkline-chart-container uk-card uk-card-default uk-card-body">
      <div className="filter">
        <button
          className={filter === "weekly" ? "active" : ""}
          onClick={() => setFilter("weekly")}>
          Weekly
        </button>
        <button
          className={filter === "monthly" ? "active" : ""}
          onClick={() => setFilter("monthly")}>
          Monthly
        </button>
      </div>
      <div className="sparkline-chart">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SparklineChart;
