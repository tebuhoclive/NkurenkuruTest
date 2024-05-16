import React, { useState } from "react";
import { faExternalLinkAlt, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useAppContext } from "../../../shared/functions/Context";
import { OpenInNew } from "@mui/icons-material";

const JobCardTable = ({
  jobCards,
  handleEdit,
  onView,
  defaultPage = 1,
  defaultItemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [itemsPerPage] = useState(defaultItemsPerPage);

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
 const { api, store } = useAppContext();
  // Get the current page items
  const currentItems = jobCards.slice(startIndex, endIndex);
 const getDisplayName = (assignedToId) => {
   const user = store.user.all.find((user) => user.asJson.uid === assignedToId);
   return user ? user.asJson.displayName : "Unknown";
 };
  const users=store.user.all
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
              <th>#</th>
              <th>Assigned To</th>
              <th>Division</th>
              <th>Section</th>
              <th>Date Issued</th>
              <th>Client Name</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {currentItems.map((jobCard, index) => (
              <tr key={jobCard.id}>
                <td>{startIndex + index + 1}</td>
                {/* Render other table cells */}
                <td>{getDisplayName(jobCard.assignedTo)}</td>
                <td>{jobCard.division}</td>
                <td>{jobCard.section}</td>
                <td>{jobCard.dateIssued}</td>
                <td>{jobCard.clientFullName}</td>
                <td>{jobCard.urgency}</td>
                <td>{jobCard.status}</td>
                {/* Actions column */}
                <td>
                  {/* <IconButton
                    aria-label="edit"
                    onClick={() => handleEdit(jobCard.id)}
                    style={{
                      color: "black",
                      padding: "8px",
                      fontSize: "1rem",
                    }}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </IconButton> */}
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

export default JobCardTable;
