import React, { useState } from "react";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useAppContext } from "../../../shared/functions/Context";
import { OpenInNew } from "@mui/icons-material";
import { formatDate, formatTime } from "../../shared/utils/utils";

const UnallocatedJobCardTable = ({
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

  const getDivisionName = (divisionId) => {
    const division = store.jobcard.division.all.find(
      (unit) => unit.asJson.id === divisionId
    );
    return division ? division.asJson.name : "Unknown";
  };

  const getSectionName = (secId) => {
    const section = store.jobcard.section.all.find(
      (section) => section.asJson.id === secId
    );
    return section ? section.asJson.name : "Unknown";
  };


const sortedJobCards = [...jobCards].sort((a, b) => {
  // Convert dateIssued strings to Date objects for comparison
  const dateA = new Date(a.dateIssued).getTime();
  const dateB = new Date(b.dateIssued).getTime();

  // Compare the dates for sorting: most recent first
  return dateB - dateA;
});
 
  // Function to render time difference for each job card
  // const renderTimeDifference = (jobCardId) => {
  //   const timeDiffObject = timeSinceIssuanceArray.find(
  //     (item) => item.jobCardId === jobCardId
  //   );
  //   if (!timeDiffObject) return null;

  //   const { timeDiff } = timeDiffObject;
  //   const millisecondsToMinutes = timeDiff / (1000 * 60);
  //   const millisecondsToHours = millisecondsToMinutes / 60;
  //   const millisecondsToDays = millisecondsToHours / 24;
  //   const millisecondsToWeeks = millisecondsToDays / 7;
  //   const millisecondsToMonths = millisecondsToDays / 30.44;

  //   const formattedTimeDifference =
  //     millisecondsToMinutes < 60
  //       ? `${Math.floor(millisecondsToMinutes)} minutes`
  //       : millisecondsToHours < 24
  //       ? `${Math.floor(millisecondsToHours)} hours`
  //       : millisecondsToDays < 7
  //       ? `${Math.floor(millisecondsToDays)} days`
  //       : millisecondsToWeeks < 4
  //       ? `${Math.floor(millisecondsToWeeks)} weeks`
  //       : `${Math.floor(millisecondsToMonths)} months`;

  //   return formattedTimeDifference;
  // };

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
              <th>Urgency</th>
              <th>Section</th>
              <th>Division</th>
              <th>Assigned To</th>
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
                  <td>{formatDate(jobCard.dateIssued)}</td>
                  <td>{formatTime(jobCard.dateIssued)}</td>
                  <td>{jobCard.urgency}</td>
                  <td>{getDivisionName(jobCard.division)}</td>
                  <td>{getSectionName(jobCard.section)}</td>
                  <td>{getDisplayName(jobCard.assignedTo)}</td>
                  <td>{jobCard.status}</td>

                  {/* Render time difference */}
                  <td>
                    <IconButton
                      aria-label="view"
                      data-uk-tooltip="Allocate Job Card"
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

export default UnallocatedJobCardTable;
