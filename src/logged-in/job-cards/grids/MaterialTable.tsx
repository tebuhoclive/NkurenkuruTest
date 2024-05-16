import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import React, { useState } from "react";

const MaterialTable = ({
  materialList,
  status = "",
  handleEdit,
  onDeleteMaterial,
  defaultPage = 1,
  defaultItemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [itemsPerPage] = useState(defaultItemsPerPage);

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the current page items
  const currentItems = materialList.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (action) => {
    if (action === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (action === "next" && endIndex < materialList.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {" "}
      <div style={{ height: "300px", overflowY: "auto" }}>
        {" "}
        {/* Fixed height with vertical scrolling */}
        <table className="kit-table uk-table uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((material, index) => (
              <tr key={material.id}>
                <td>{startIndex + index + 1}</td>
                <td>{material.name}</td>
                <td>N$ {material.unitCost}</td>
                <td>{material.quantity}</td>
                <td>
                  {status !== "Completed" && (
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(material)}
                        style={{
                          color: "black",
                          padding: "8px",
                          fontSize: "1rem",
                        }}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => onDeleteMaterial(e, material.id)}
                        style={{
                          color: "black",
                          padding: "8px",
                          fontSize: "1rem",
                        }}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}>
          Prev
        </button>
        <button
          onClick={() => handlePageChange("next")}
          disabled={endIndex >= materialList.length}>
          Next
        </button>
      </div>
    </>
  );
};

export default MaterialTable;
