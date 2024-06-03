import React from "react";
import { Doughnut } from "react-chartjs-2";
import "./CostChart.scss";

const CostChart = () => {
  const totalCost = 500000;
  const yearlyCost = totalCost * 0.75; // Example: 75% of total cost is yearly cost

  const data = {
    labels: ["Yearly Cost", "Remaining Cost"],
    datasets: [
      {
        data: [yearlyCost, totalCost - yearlyCost],
        backgroundColor: ["blue", "purple"],
        borderWidth: 0,
        borderRadius: 10, // Apply border radius uniformly
      },
    ],
  };

  const options = {
    rotation: -135, // Start at the top left
    circumference: 270, // 270 degrees arc
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    cutout: "80%", // Adjust the size of the center cutout
  };

  return (
    <div className="cost-chart-container  uk-card uk-card-default uk-card-body uk-border-radius">
      <div className="doughnut-chart ">
        <Doughnut data={data} options={options} />
        <div className="chart-middle-text">
          <div>Total Cost</div>
          <div>N$ 500 000</div>
          <div>
            Yearly <br /> {Math.round((yearlyCost / totalCost) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostChart;
