import React, { useState } from "react";
import "uikit/dist/css/uikit.min.css";
import ReactPaginate from "react-paginate";
import { CircularProgressbar } from "react-circular-progressbar";
import './assignUser.css'; // Import your custom styles

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

  // Get the length of userJobCards
  const totalJobcards = userJobCards.length;

  const executionRate = (completedCount / totalJobcards) * 100;

  // Calculate completion percentage
  const percentage = totalJobcards ? (completedCount / totalJobcards) * 100 : 0;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="uk-container uk-container-xlarge  uk-margin left">
      <div className="uk-grid uk-grid-small uk-margin" data-uk-grid>
        <div className="uk-width-1-2">
          <table className="uk-table uk-table-small uk-table-divider custom-table">
            <tbody>
              <tr className="custom-row">
                <td>Total Job Cards</td>
                <td>{totalJobcards}</td>
              </tr>
              <tr className="custom-row">
                <td>Completed</td>
                <td>{completedCount}</td>
              </tr>
              <tr className="custom-row">
                <td>In Progress</td>
                <td>{inProgressCount}</td>
              </tr>
              <tr className="custom-row">
                <td>Overdue</td>
                <td>{overdueCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="uk-width-1-2">
          <div
            className="inner"
            style={{
              width: "200px",
              height: "200px",
              marginLeft: "150px",
              marginTop: "-20px",
            }}>
            <CircularProgressbar
              value={percentage}
              maxValue={100}
              text={`${percentage.toFixed(1)} % Execution Rate`}
              styles={{
                path: { stroke: `#4caf50` },
                text: {
                  fontSize: ".5rem",
                  dominantBaseline: "middle",
                  textAnchor: "middle",
                }, // Center the text vertically and horizontally
              }}
            />
          </div>
        </div>

        <table className="custom-table" style={{ marginTop: "50px" }}>
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
                <td>{new Date(jobCard.dateIssued).toLocaleDateString()}</td>
                <td>{new Date(jobCard.dueDate).toLocaleDateString()}</td>
                <td>{jobCard.rating || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedUserJobCardStats;
