// Step2.tsx
// UpdateJobCard.tsx
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useAppContext } from "../../shared/functions/Context";

import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId, { hideModalFromId } from "../../shared/functions/ModalShow";
import {
  IJobCard,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import { ITask, defaultTask } from "../../shared/models/job-card-model/Task";
import { ITool, defaultTool } from "../../shared/models/job-card-model/Tool";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import AddNewMaterialModal from "./dialogs/AddNewMaterialModal";
import Modal from "../../shared/components/Modal";
import { MaterialsGrid } from "./grids/MaterialsGrid";
import SingleSelect, {
  IOption,
} from "../../shared/components/single-select/SingleSelect";
import NumberInput from "../shared/components/number-input/NumberInput";
import { IMaterial, defaultMaterial } from "../../shared/models/job-card-model/Material";

const AllocateJobCardModal = observer(() => {
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const [artesianValue, setArtesianValue] = useState(""); // State for Artesian input
  const [teamLeaderValue, setTeamLeaderValue] = useState(""); // State for Team Leader input
  const [teamMemberValue, setTeamMemberValue] = useState(""); // State for Team Member input

  // Additional state or logic specific to Step 2

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();

  const handleArtesianChange = (value) => {
    setArtesianValue(value);
    setJobCard({ ...jobCard, artesian: value });
    // Additional logic if needed
  };
  const handleTeamLeaderChange = (value) => {
    setTeamLeaderValue(value);
    setJobCard({ ...jobCard, teamLeader: value });
    // Additional logic if needed
  };
  const handleTeamMemberChange = (value) => {
    setTeamMemberValue(value);
    setJobCard({ ...jobCard, teamMember: value });
    // Additional logic if needed
  };
   const handleMeasureChange = (value) => {
     setTeamMemberValue(value);
     setJobCard({ ...jobCard, measure: value });
     // Additional logic if needed
   };

  //Kpi measures here
  const measure = store.measure.getByUid(jobCard.teamLeader);
  console.log("all me in measures", measure);

  const users = store.user.all;

  const options: IOption[] = useMemo(
    () =>
      users.map((user) => {
        return {
          label: user.asJson.displayName || "",
          value: user.asJson.uid,
        };
      }),
    [users]
  );
   const measureOptions: IOption[] = useMemo(
     () =>
       measure.map((measure) => {
         return {
           label: measure.asJson.description || "",
           value: measure.asJson.uid,
         };
       }),
     [measure]
   );

  // const taskList = store.jobcard.task.all;
  const materialList = store.jobcard.material.all;



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
     setJobCard({...jobCard, isAllocated: true})

      await api.jobcard.jobcard.update(jobCard);
      console.log("jobcard", jobCard);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error submitting form:", error);
    } finally {
      onCancel()
      setLoading(false);
    }
  };
    const onCancel = () => {
      store.jobcard.jobcard.clearSelected();
      setJobCard({ ...defaultJobCard });
      hideModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
    };

  // code for adding material
  const [showMaterialForm, setShowMaterialForm] = useState(false);
 const [newMaterial, setNewMaterial] = useState<IMaterial>({ ...defaultMaterial });
  const handleAddMaterialClick = () => {
    setShowMaterialForm(true);
  };

  const handleMaterialAdded = async (e) => {
    e.preventDefault();

    // Validate if unit cost or quantity is negative or zero
    if (newMaterial.unitCost <= 0 || isNaN(newMaterial.unitCost)) {
      setUnitCostErrorMessage("Unit cost must be a positive number.");
      return; // Exit function if validation fails
    }

    if (newMaterial.quantity <= 0 || isNaN(newMaterial.quantity)) {
      setQuantityErrorMessage("Quantity must be a positive number.");
      return; // Exit function if validation fails
    }

      try {
        // Create the material on the server
        const id = jobCard.id;
        await api.jobcard.material.create( newMaterial,
          id
          // jobCard.id
        );

        // Clear the form
        setNewMaterial({ ...defaultMaterial });
      } catch (error) {
        // Handle error appropriately
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false); // Make sure to reset loading state regardless of success or failure
        // onCancel();
      }
    // Clear any previous error messages
    setUnitCostErrorMessage("");
    setQuantityErrorMessage("");

   
    setShowMaterialForm(false);
  };

  // Function to handle changes for Material Name
  const handleMaterialNameChange = (e) => {
    const value = e.target.value;
    setNewMaterial({
      ...newMaterial,
      name: value,
    });
  };

  // Define function to handle changes in unit cost
  // State variables
  const [unitCostErrorMessage, setUnitCostErrorMessage] = useState("");
  const [quantityErrorMessage, setQuantityErrorMessage] = useState("");

  // Define function to handle changes in unit cost
  const handleUnitCostChange = (value) => {
    // Ensure value is not negative or zero
    if (value <= 0 || isNaN(value)) {
      // Display error message
      setUnitCostErrorMessage("Unit cost must be a positive number.");
      return;
    }
    // Clear error message
    setUnitCostErrorMessage("");
    // Update state with new unit cost value
    setNewMaterial({
      ...newMaterial,
      unitCost: value,
    });
  };

  // Define function to handle changes in quantity
  const handleQuantityChange = (value) => {
    // Ensure value is not negative or zero
    if (value <= 0 || isNaN(value)) {
      // Display error message
      setQuantityErrorMessage("Quantity must be a positive number.");
      return;
    }
    // Clear error message
    setQuantityErrorMessage("");
    // Update state with new quantity value
    setNewMaterial({
      ...newMaterial,
      quantity: value,
    });
  };

  // Function to get the display name based on the assignedTo ID
  const getDisplayName = (assignedToId) => {
    const user = store.user.all.find(
      (user) => user.asJson.uid === assignedToId
    );
    return user ? user.asJson.displayName : "Unknown";
  };

  useEffect(() => {
    const selectedJobCard = store.jobcard.jobcard.selected;
    if (selectedJobCard) {
      setJobCard(selectedJobCard);
    }
    const loadData = async () => {
      await api.user.getAll();
      await api.jobcard.jobcard.getAll;

      await api.measure.getAll();
      await api.department.getAll();
    };
    loadData();
  }, [
    api.user,
    api.jobcard,
    api.department,
    store.jobcard.jobcard.selected,
    api.measure,
  ]);

  return (
    <ErrorBoundary>
      <div
        className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2"
        style={{ width: "80%" }}>
        <button
          className="uk-modal-close-default"
          // onClick={onCancel}
          disabled={loading}
          type="button"
          data-uk-close></button>
        <h3 className="main-title-small text-to-break"> Job Card Allocation</h3>
        <hr />

        <div className="uk-grid">
          <div className="uk-width-1-3">
            {jobCard && (
              <div className="uk-width-1-1 uk-margin-medium-top">
                <h4>Selected Job Card Details</h4>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                  <div className="uk-width-1-3">
                    <p>Assigned To:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getDisplayName(jobCard.assignedTo)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Section:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.section}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Division.</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.division}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Urgency</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.urgency}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Unique ID.</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.uniqueId}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Task Description:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.taskDescription}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-1">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                </div>
              </div>
            )}
            {jobCard && (
              <div className="uk-width-1-1 uk-margin-large-top">
                <h4>Selected Job Card Client Details</h4>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                  <div className="uk-width-1-3">
                    <p>Full Name:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientFullName}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Address :</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientAddress}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Phone No.</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientMobileNumber}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Email</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                </div>
              </div>
            )}
          </div>

          <div className="dialog-content uk-position-relative uk-width-2-3">
            <h4>Job Card Management and allocation</h4>

            <hr />
            <form
              className="review-info uk-card uk-card-default uk-card-body uk-card-small "
              style={{ justifyContent: "center" }}
              onSubmit={handleSubmit}>
              {/* Add Task Section */}
              {/* <h3>Job Card Management and allocation {jobCard.uniqueId}</h3> */}

              {/* <div className="uk-grid">
                <div className="uk-width-1-4">
                  <div className="uk-margin">
                    <input
                      placeholder="Start Date"
                      id="issuedDate"
                      type="date"
                      value={jobCard.dateIssued}
                      onChange={(e) =>
                        setJobCard({ ...jobCard, dateIssued: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="uk-width-1-4">
                  <div className="uk-margin">
                    <input
                      placeholder="Issued Time"
                      id="issuedTime"
                      type="time"
                      value={jobCard.dueDate}
                      onChange={(e) =>
                        setJobCard({ ...jobCard, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div> */}

              <>
                <div className="uk-grid">
                  <div className="uk-width-1-4">
                    <div className="uk-margin">
                      <label htmlFor="issuedDate">Artesian </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          width="250px"
                          onChange={handleArtesianChange}
                          placeholder="Search by name"
                          value={artesianValue}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-1-4">
                    <div className="uk-margin">
                      <label htmlFor="issuedTime">Team Leader</label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          width="250px"
                          onChange={handleTeamLeaderChange}
                          placeholder="Search by name"
                          value={teamLeaderValue}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-1-4">
                    <div className="uk-margin">
                      <label htmlFor="issuedTime">Team Member</label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          width="250px"
                          onChange={handleTeamMemberChange}
                          placeholder="Search by name"
                          value={teamMemberValue}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="uk-width-1-4">
                <div className="uk-margin">
                  <UserDetails displayName={artesianValue} />
                  <UserDetails displayName={teamLeaderValue} />
                  <UserDetails displayName={teamMemberValue} />
                </div>
              </div> */}
                </div>
              </>
              <div className="uk-width-1-1">
                <div className="uk-margin">
                  <label htmlFor="issuedTime">
                    Please select your KPI aligned with the job card
                  </label>
                  <div className="uk-form-controls">
                    <SingleSelect
                      name="search-team"
                      options={measureOptions}
                      width="250px"
                      onChange={handleMeasureChange}
                      placeholder="Select KPI"
                      value={jobCard.measure}
                    />
                  </div>
                </div>
              </div>

              <div className="uk-grid">
                <div className="uk-width-1-1">
                  <h3>Material List</h3>
                  <MaterialsGrid data={materialList} jobCard={jobCard} />
                  {!showMaterialForm && (
                    <button
                      className="btn btn-primary"
                      onClick={handleAddMaterialClick}>
                      <span>Add Material&nbsp;&nbsp;</span>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="icon uk-margin-small-right"
                      />
                    </button>
                  )}
                  {showMaterialForm && (
                    <div>
                      <h4>Add New Material</h4>
                      <div>
                        <div className="uk-margin">
                          <label
                            className="uk-form-label"
                            htmlFor="materialName">
                            Material Name:
                          </label>
                          <input
                            type="text"
                            id="materialName"
                            name="name"
                            value={newMaterial.name}
                            onChange={handleMaterialNameChange}
                            className="uk-input"
                          />
                        </div>
                        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                          <label
                            className="uk-form-label required"
                            htmlFor="amount">
                            Cost Amount (min N$ 1 000.00)
                          </label>
                          <NumberInput
                            id="amount"
                            className="auto-save uk-input purchase-input uk-form-small"
                            placeholder="-"
                            value={newMaterial.unitCost}
                            onChange={(value) => handleUnitCostChange(value)}
                            decimalScale={2}
                          />
                          {unitCostErrorMessage && (
                            <div className="uk-alert-danger" data-uk-alert>
                              <p>{unitCostErrorMessage}</p>
                            </div>
                          )}
                        </div>
                        <div className="uk-margin">
                          <label
                            className="uk-form-label"
                            htmlFor="materialQuantity">
                            Quantity:
                          </label>
                          <NumberInput
                            id="materialQuantity"
                            className="uk-input"
                            value={newMaterial.quantity}
                            onChange={(value) => handleQuantityChange(value)}
                          />
                          {quantityErrorMessage && (
                            <div className="uk-alert-danger" data-uk-alert>
                              <p>{quantityErrorMessage}</p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={handleMaterialAdded}
                          className="btn btn-primary">
                          Add Material
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="uk-margin">
                <label htmlFor="remarks">Remarks:</label>
                <textarea
                  id="remarks"
                  className="uk-textarea"
                  placeholder="Enter remarks..."
                  value={jobCard.comment}
                  onChange={(e) =>
                    setJobCard({ ...jobCard, comment: e.target.value })
                  }
                />
              </div>

              <div
                className="uk-width-1-1 uk-text-right"
                style={{ marginTop: "20px" }}>
                <div
                  className="uk-width-1-1 uk-text-right"
                  style={{ marginTop: "10px" }}>
                  {/* <button >Next</button> */}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}>
                    allocate and Complete{" "}
                    {loading && <div data-uk-spinner="ratio: .5"></div>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default AllocateJobCardModal;
