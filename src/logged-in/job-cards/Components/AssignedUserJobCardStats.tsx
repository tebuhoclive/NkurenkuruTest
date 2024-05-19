import React, { useState } from "react";
import "uikit/dist/css/uikit.min.css";
import ReactPaginate from "react-paginate";

const AssignedUserJobCardStats = ({ userId, userName, jobCards }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Filter job cards for the assigned user
  const userJobCards = jobCards.filter(
    (jobCard) => jobCard.assignedTo === userId
  );

  // Calculate statistics for the assigned user's job cards
  const completedCount = userJobCards.filter(
    (jobCard) => jobCard.status === "Completed"
  ).length;

  const inProgressCount = userJobCards.filter(
    (jobCard) => jobCard.status === "In Progress"
  ).length;

  const overdueCount = userJobCards.filter(
    (jobCard) =>
      new Date(jobCard.dueDate) < new Date() && jobCard.status !== "Completed"
  ).length;

  // Pagination logic
  const pageCount = Math.ceil(userJobCards.length / itemsPerPage);
  const displayJobCards = userJobCards.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="uk-container">
      <div className="uk-grid small uk-child-width-1-2">
        <div>
          <div className="uk-card uk-card-default uk-card-body">
            <h4 className="uk-text-bold">
              Total User Performance for {userName}
            </h4>
            <p>Total Job Cards: {userJobCards.length}</p>
            <p>Completed: {completedCount}</p>
            <p>In Progress: {inProgressCount}</p>
            <p>Overdue: {overdueCount}</p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-default uk-card-body">
            <h3>Job Cards</h3>
            <div >
              <table className="uk-table uk-table-divider uk-table-striped uk-table-small">
                <thead>
                  <tr>
                    <th>Unique ID</th>
                    <th>Task Description</th>
                    <th>Status</th>
                    <th>Date Issued</th>
                    <th>Due Date</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {displayJobCards.map((jobCard) => (
                    <tr key={jobCard.id}>
                      <td>{jobCard.uniqueId}</td>
                      <td>{jobCard.taskDescription}</td>
                      <td>{jobCard.status}</td>
                      <td>
                        {new Date(jobCard.dateIssued).toLocaleDateString()}
                      </td>
                      <td>{new Date(jobCard.dueDate).toLocaleDateString()}</td>
                      <td>{jobCard.rating || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedUserJobCardStats;
