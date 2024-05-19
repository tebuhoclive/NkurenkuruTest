import React, { useEffect, useState } from "react";
import {
  faBell,
  faCheck,
  faComment,
  faCopy,
  faExternalLinkAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useAppContext } from "../../../shared/functions/Context";
import { OpenInNew } from "@mui/icons-material";
import Rating from "../Components/Rating";
import { formatDate, formatTime } from "../../shared/utils/utils";
// import Rating from "../Components/Rating";

const CompletedJobCardTable = ({
  jobCards,

  onView,
  defaultPage = 1,
  defaultItemsPerPage = 5,
  timeSinceIssuanceArray = [],
  ratings,
  handleRatingChange,
  comment,
  setComment,
  commentIndex,
  setCommentIndex,
  handleCommentChange,
  handleCommentSubmit,
  handleCancel,
  onDuplicate,
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

  // const getBusinessUnitName = (businessId) => {
  //   const unit = store.businessUnit.all.find(
  //     (unit) => unit.asJson.id === businessId
  //   );
  //   return unit ? unit.asJson.name : "Unknown";
  // };

  // const getDepartmentName = (deptId) => {
  //   const dept = store.department.all.find((user) => user.asJson.id === deptId);
  //   return dept ? dept.asJson.name : "Unknown";
  // };

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

  // const [comment, setComment] = useState("");
  // const [commentIndex, setCommentIndex] = useState(null);

  // const handleCommentChange = (e) => {
  //   setComment(e.target.value);
  // };

  // const handleCommentSubmit = (jobCardId) => {
  //   // Send the comment to the server or update the job card with the comment
  //   console.log(
  //     "Comment submitted for Job Card ID:",
  //     jobCardId,
  //     "Comment:",
  //     comment
  //   );
  //   setComment(""); // Clear the comment input
  //   setCommentIndex(null); // Close the comment input box
  // };
  // const handleCancel = (jobCardId) => {
  //   setComment(""); // Clear the comment input
  //   setCommentIndex(null); // Close the comment input box
  // };

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
              <th>Rating</th>
              <th>Status</th>
              <th>Comment</th>
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
                  <td>{formatDate(jobCard.dueDate)}</td>
                  <td>{formatTime(jobCard.dueDate)}</td>
                  <td>{getDisplayName(jobCard.assignedTo)}</td>
                  <td>{getDisplayName(jobCard.artesian)}</td>
                  <td>
                    <Rating
                      value={jobCard.rating || 0}
                      onChange={(newRating) =>
                        handleRatingChange(jobCard.id, newRating)
                      }
                    />
                  </td>
                  <td>{jobCard.status}</td>
                  <td>
                    {commentIndex === jobCard.id ? (
                      <div>
                        <textarea
                          value={comment}
                          onChange={(e) => handleCommentChange(e)}
                          placeholder="Enter your comment..."
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                          }}>
                          <IconButton
                            onClick={() => handleCommentSubmit(jobCard.id)}
                            style={{ padding: "4px", fontSize: "0.8rem" }}>
                            <FontAwesomeIcon icon={faCheck} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleCancel(jobCard.id)}
                            style={{ padding: "4px", fontSize: "0.8rem" }}>
                            <FontAwesomeIcon icon={faTimes} />
                          </IconButton>
                        </div>
                      </div>
                    ) : (
                      <div style={{ position: "relative" }}>
                        {jobCard.comments && (
                          <FontAwesomeIcon
                            icon={faBell}
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "8px",
                              transform: "translateY(-50%)",
                              color: "red",
                            }}
                          />
                        )}
                        <IconButton
                          aria-label="comment"
                          onClick={() => setCommentIndex(jobCard.id)}
                          style={{
                            color: "black",
                            padding: "8px",
                            fontSize: "1rem",
                          }}>
                          <FontAwesomeIcon icon={faComment} />
                        </IconButton>
                      </div>
                    )}
                  </td>

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
                    <IconButton
                      aria-label="duplicate"
                      onClick={() => onDuplicate(jobCard)}
                      style={{
                        color: "black",
                        padding: "8px",
                        fontSize: "1rem",
                      }}>
                      <FontAwesomeIcon icon={faCopy} />
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

export default CompletedJobCardTable;
