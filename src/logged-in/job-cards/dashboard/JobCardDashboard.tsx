import React from 'react';

import './JobCardDashboard.scss';
import JobCardStats from '../Components/Stats-card/JobCardStats';
import JobCardSectionChart from '../Components/section-charts/JobCardSectionChart';
import JobCardProgress from '../Components/jobcard-progress/JobCardProgress';
import JobCardLineChart from '../Components/jobcard-Line-chart/JobCardLineChart';

const JobCardDashboard = () => {
  // Declare the data directly in the dashboard
  const stats = {
    total: 120,
    pending: 35,
    approved: 50,
    assigned: 20,
    completed: 15,
  };

  const sectionData = {
    sections: ['Water', 'Waste Management', 'Roads', 'Parks', 'Electricity'],
    jobCardCount: [30, 20, 40, 15, 15],
  };

  const progressData = {
    approved: 50,
    assigned: 20,
    completed: 15,
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Pending',
        data: [25, 20, 35, 40],
        borderColor: '#ffc107',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Approved',
        data: [10, 15, 20, 50],
        borderColor: '#007bff',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Completed',
        data: [5, 10, 15, 25],
        borderColor: '#28a745',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Grid for job card statistics */}
      <div className="dashboard-grid">
        <JobCardStats title="Total Job Cards" value={stats.total} />
        <JobCardStats title="Pending Job Cards" value={stats.pending} />
        <JobCardStats title="Approved Job Cards" value={stats.approved} />
        <JobCardStats title="Assigned Job Cards" value={stats.assigned} />
        <JobCardStats title="Completed Job Cards" value={stats.completed} />
      </div>

      {/* Additional Dashboard Components */}
      <div className="additional-components">
        <div className="component-item">
          <h3>Job Cards by Section</h3>
          <JobCardSectionChart data={sectionData} />
        </div>
        <div className="component-item">
          <h3>Job Card Progress</h3>
          <JobCardProgress data={progressData} />
        </div>
        <div className="component-item">
          <h3>Job Cards Trend</h3>
          <JobCardLineChart data={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default JobCardDashboard;
