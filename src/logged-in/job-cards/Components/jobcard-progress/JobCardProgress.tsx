import React from 'react';

const JobCardProgress = ({ data }) => {
  const total = data.approved + data.assigned + data.completed;
  
  return (
    <div className="progress-bar">
      <div className="progress-section approved" style={{ width: `${(data.approved / total) * 100}%` }}>
        Approved ({data.approved})
      </div>
      <div className="progress-section assigned" style={{ width: `${(data.assigned / total) * 100}%` }}>
        Assigned ({data.assigned})
      </div>
      <div className="progress-section completed" style={{ width: `${(data.completed / total) * 100}%` }}>
        Completed ({data.completed})
      </div>
    </div>
  );
};

export default JobCardProgress;
