import React from 'react';
import { Bar } from 'react-chartjs-2';

const JobCardSectionChart = ({ data }) => {
  const chartData = {
    labels: data.sections,
    datasets: [
      {
        label: 'Job Cards',
        data: data.jobCardCount,
        backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545', '#17a2b8'],
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default JobCardSectionChart;
