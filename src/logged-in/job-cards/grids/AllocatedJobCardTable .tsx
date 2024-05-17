import React, { useState } from "react";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useAppContext } from "../../../shared/functions/Context";
import { OpenInNew } from "@mui/icons-material";

const AllocatedJobCardTable = ({
  jobCards,
  handleEdit,
  onView,
  defaultPage = 1,
  defaultItemsPerPage = 5,
  timeSinceIssuanceArray = [], // Provide a default empty array
}) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [itemsPerPage] = useState(defaultItemsPerPage);

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { api, store } = useAppContext();

  // Function to get display name from assignedToId
  const getDisplayName = (assignedToId) => {
    const user = store.user.all.find(
      (user) => user.asJson.uid === assignedToId
    );
    return user ? user.asJson.displayName : "Unknown";
  };

  const getBusinessUnitName = (businessId) => {
    const unit = store.businessUnit.all.find(
      (unit) => unit.asJson.id === businessId
    );
    return unit ? unit.asJson.name : "Unknown";
  };

  const getDepartmentName = (deptId) => {
    const dept = store.department.all.find((user) => user.asJson.id === deptId);
    return dept ? dept.asJson.name : "Unknown";
  };

  const sortedJobCards = [...jobCards].sort((a, b) => {
    // Find the time difference objects for the current job cards
    const timeDiffA = timeSinceIssuanceArray.find(
      (item) => item.jobCardId === a.id
    );
    const timeDiffB = timeSinceIssuanceArray.find(
      (item) => item.jobCardId === b.id
    );

    // Compare the time differences for sorting
    return timeDiffA?.timeDiff - timeDiffB?.timeDiff;
  });
  // Function to render time difference for each job card
  const renderTimeDifference = (jobCardId) => {
    const timeDiffObject = timeSinceIssuanceArray.find(
      (item) => item.jobCardId === jobCardId
    );
    if (!timeDiffObject) return null;

    const { timeDiff } = timeDiffObject;
    const millisecondsToMinutes = timeDiff / (1000 * 60);
    const millisecondsToHours = millisecondsToMinutes / 60;
    const millisecondsToDays = millisecondsToHours / 24;
    const millisecondsToWeeks = millisecondsToDays / 7;
    const millisecondsToMonths = millisecondsToDays / 30.44;

    const formattedTimeDifference =
      millisecondsToMinutes < 60
        ? `${Math.floor(millisecondsToMinutes)} minutes`
        : millisecondsToHours < 24
        ? `${Math.floor(millisecondsToHours)} hours`
        : millisecondsToDays < 7
        ? `${Math.floor(millisecondsToDays)} days`
        : millisecondsToWeeks < 4
        ? `${Math.floor(millisecondsToWeeks)} weeks`
        : `${Math.floor(millisecondsToMonths)} months`;

    return formattedTimeDifference;
  };

  // Function to handle page change
  const handlePageChange = (action) => {
    if (action === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (action === "next" && endIndex < jobCards.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="people-tab-content uk-card uk-card-default uk-card-body">
      <div style={{ height: "400px", overflowY: "auto" }}>
        <table className="kit-table uk-table uk-table-small uk-table-striped">
          {/* Table headers */}
          <thead>
            <tr>
              <th>Job Card No</th>
              <th>Date logged</th>
              <th>Time logged</th>
              <th>Due Date</th>
              <th>Time Due</th>
              <th>Assigned To</th>
              <th>Artisan/Foreman</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {sortedJobCards
              .slice(startIndex, endIndex)
              .map((jobCard, index) => (
                <tr key={jobCard.id}>
                  <td>{jobCard.uniqueId}</td>
                  <td>{jobCard.dateIssued}</td>
                  <td>{jobCard.dateIssued}</td>
                  <td>{jobCard.dateIssued}</td>
                  <td>{jobCard.dateIssued}</td>
                  <td>{getDisplayName(jobCard.assignedTo)}</td>
                  <td>{getDisplayName(jobCard.artisan)}</td>
                  <td>{jobCard.status}</td>

                  {/* Render time difference */}
                  <td>
                    <IconButton
                      aria-label="view"
                      onClick={() => onView(jobCard)}
                      style={{
                        color: "black",
                        padding: "8px",
                        fontSize: "1rem",
                      }}>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </IconButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}>
          Prev
        </button>
        <button
          onClick={() => handlePageChange("next")}
          disabled={endIndex >= jobCards.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AllocatedJobCardTable;
