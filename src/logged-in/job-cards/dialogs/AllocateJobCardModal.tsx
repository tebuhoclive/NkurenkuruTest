// Step2.tsx
// UpdateJobCard.tsx
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { useState, useEffect, FormEvent } from "react";
import { useAppContext } from "../../../shared/functions/Context";

import MODAL_NAMES from "../../dialogs/ModalName";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import {
  IJobCard,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

import SingleSelect, {
  IOption,
} from "../../../shared/components/single-select/SingleSelect";
import NumberInput from "../../shared/components/number-input/NumberInput";
import {
  IMaterial,
  defaultMaterial,
} from "../../../shared/models/job-card-model/Material";
import MaterialTable from "../grids/MaterialTable";

const AllocateJobCardModal = observer(() => {
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const [artesianValue, setArtesianValue] = useState(""); // State for Artesian input
  const [teamLeaderValue, setTeamLeaderValue] = useState(""); // State for Team Leader input
  const [teamMemberValue, setTeamMemberValue] = useState([]); // State for Team Member input
  const [material, setMaterial] = useState<IMaterial>({ ...defaultMaterial });

  // Additional state or logic specific to Step 2

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

  const handleTeamMemberChange = (selectedOptions) => {
    // selectedOptions is an array containing the selected option objects
    // You can access the selected values and perform any necessary actions

    // For example, you can extract the selected values and store them in state
    const selectedValues = selectedOptions.map((option) => option.value);
    console.log(selectedValues); // Assuming setTeamMembers is a state update function
    setTeamMemberValue(selectedValues);
  };

  const handleMeasureChange = (value) => {
    setTeamMemberValue(value);
    setJobCard({ ...jobCard, measure: value });
    // Additional logic if needed
  };

  //Kpi measures here
  const measure = store.measure.getByUid(jobCard.teamLeader);
  console.log("all me in measures", measure);
  const materialCost = store.jobcard.material.all;

  //calculate material cost
  // test store
  const currentid = jobCard.id;
  const allMaterial = store.jobcard.material.getAllMaterialById(currentid);
  console.log("Current id ", allMaterial);

  // Calculate the total material cost
  const totalMaterialCost = materialCost.reduce((total, material) => {
    return total + material.unitCost;
  }, 0);

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
  const currentMaterialList = materialList.filter(
    (material) => material.jId === jobCard.id
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update the job card object locally
      const updatedJobCard: IJobCard = {
        ...jobCard,
        isAllocated: true,
        jobcardCost: totalMaterialCost,
        teamLeader: teamLeaderValue,
        artesian: artesianValue,
        assignedTo: teamLeaderValue,
        teamMembers: teamMemberValue,
        reworked: reworked,
        status: "In Progress",
      };

      // Call the API to update the job card with the updated object
      await api.jobcard.jobcard.update(updatedJobCard);
      console.log("jobcard", updatedJobCard);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error submitting form:", error);
    } finally {
      SendEmailNotification();
      onCancel();
      setLoading(false);
      store.jobcard.material.clearSelected();
      store.jobcard.jobcard.clearSelected();
    }
  };

  const onCancel = () => {
    setArtesianValue(""); // State for Artesian input
    setTeamLeaderValue(""); // State for Team Leader input
    setTeamMemberValue([]); // State for Team Member input
    store.jobcard.jobcard.clearSelected();
    store.jobcard.material.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };

  // code for adding material
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  // code for adding material
  const [showEditMaterialForm, setShowEditMaterialForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState<IMaterial>({
    ...defaultMaterial,
  });
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
    const updatedMaterial = { ...newMaterial, jId: jobCard.id };
    try {
      // Create the material on the server
      const id = jobCard.id;
      await api.jobcard.material.create(
        updatedMaterial,
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

  // Define function to handle changes in unit cost
  // State variables
  const [unitCostErrorMessage, setUnitCostErrorMessage] = useState("");
  const [quantityErrorMessage, setQuantityErrorMessage] = useState("");
  const [reworked, setReworked] = useState("No");

  // Define function to handle changes in unit cost

  const handleMaterialNameChangeOnEdit = (e) => {
    const value = e.target.value;
    setMaterial({
      ...material,
      name: value,
    });
  };
  const handleUnitCostChangeOnEdit = (value) => {
    // Ensure value is not negative or zero
    if (value <= 0 || isNaN(value)) {
      // Display error message
      setUnitCostErrorMessage("Unit cost must be a positive number.");
      return;
    }
    // Clear error message
    setUnitCostErrorMessage("");
    // Update state with new unit cost value
    setMaterial({
      ...material,
      unitCost: value,
    });
  };
  const handleQuantityChangeOnEdit = (value) => {
    // Ensure value is not negative or zero
    if (value <= 0 || isNaN(value)) {
      // Display error message
      setQuantityErrorMessage("Quantity must be a positive number.");
      return;
    }
    // Clear error message
    setQuantityErrorMessage("");
    // Update state with new quantity value
    setMaterial({
      ...material,
      quantity: value,
    });
  };

  // Function to handle changes for Material Name
  const handleMaterialNameChange = (e) => {
    const value = e.target.value;
    setNewMaterial({
      ...newMaterial,
      name: value,
    });
  };
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

  const SendEmailNotification = async () => {
    try {
      const htmlContent = `
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 1200px; margin: 20px auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; text-align: left;">
          <h2 style="color: #333333; margin-bottom: 10px;">Dear ${getDisplayName(
            jobCard.assignedTo
          )},</h2>
          <!-- Add your simple text content here -->
          <p style="color: #666666; font-size: 14px; margin-top: 10px;">
            <br />
            <br />
            You have been assigned to a job card on the performance management system. Please login to review and get details about the job card.
            <br />
            Kind regards,
            <br />
          </p>
          <p>Please contact us if you have any queries or require further information.</p>
          <p style="color: #666666; font-size: 14px;">Thank you for your business.</p>
          <div style="margin-top: 10px; font-style: italic; color: #999999;">
            <p style="font-size: 12px;">Kind regards,<br />IJG</p>
          </div>
        </div>
      </body>
    `;
      const to = "tebuhoclive14@gmail.com";
      const from = "tebuhoclive14@gmail.com";
      const subject = "PMS Job Card Allocation";

      const response = await fetch(
        "https://us-central1-functions-918c1.cloudfunctions.net/sendNotificationEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            htmlContent: htmlContent,
            subject: subject,
            to: to,
            from: from,
          }),
        }
      );

      if (response.ok) {
        // Email sent successfully
        console.log("Email sent successfully");
      } else {
        // Email sending failed
        console.error("Error sending email:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Function to get the display name based on the assignedTo ID
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

  const onDeleteMaterial = async (e, materialId: string) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Delete the material on the server
      await api.jobcard.material.delete(materialId, jobCard.id);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };
  const onEditMaterial = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      if (material && jobCard) {
        // Update the material on the server
        await api.jobcard.material.update(material, jobCard.id);
      }
      setShowEditMaterialForm(false);
    } catch (error) {
      console.error("Error updating material:", error);
    }
  };

  const handleEdit = async (material: IMaterial) => {
    if (material) {
      setMaterial(material);
      setShowEditMaterialForm(true);
    }
    try {
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };
  useEffect(() => {
    const selectedJobCard = store.jobcard.jobcard.selected;
    if (selectedJobCard) {
      setJobCard(selectedJobCard);
    }
    const loadData = async () => {
      await api.user.getAll();
      await api.jobcard.jobcard.getAll;
      const id = jobCard.id;
      if (id) {
        console.log("id is true");
        await api.jobcard.material.getAll(id);
      }
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
    jobCard,
  ]);

  return (
    <ErrorBoundary>
      <div
        className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2"
        style={{ width: "80%" }}>
        <button
          className="uk-modal-close-default"
          onClick={onCancel}
          disabled={loading}
          type="button"
          data-uk-close></button>
        {/* <h3 className="main-title-small text-to-break"> Job Card Allocation</h3> */}
        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          Allocate Job card
        </span>
        <hr />

        <div className="uk-grid">
          <div className="uk-width-1-3">
            {jobCard && (
              <div className="uk-width-1-1 uk-margin-medium-top">
                <h4 style={{ fontWeight: "bold" }}>Job Card Details</h4>

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
                    <p>{getDepartmentName(jobCard.section)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Division.</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getBusinessUnitName(jobCard.division)}</p>
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
                    <p>{jobCard.dueDate}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                </div>
              </div>
            )}
            {jobCard && (
              <div className="uk-width-1-1 uk-margin-large-top">
                <h4 style={{ fontWeight: "bold" }}>Job Card Client Details</h4>
                {/* <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                  Job Card Client Details
                </span> */}
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
                </div>
              </div>
            )}
          </div>

          <div className="dialog-content uk-position-relative uk-width-2-3">
            <h4 style={{ fontWeight: "bold" }}>
              Job Card Management and allocation
            </h4>

            <hr />
            <form
              className="uk-form uk-grid uk-grid-small"
              onSubmit={handleSubmit}>
              <>
                <div className="uk-grid">
                  <div className="uk-width-1-2">
                    <div>
                      <label htmlFor="issuedDate">
                        Artesian<span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          // width="250px"
                          onChange={handleArtesianChange}
                          placeholder="Search by name"
                          value={artesianValue}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-1-2">
                    <div>
                      <label htmlFor="issuedTime">
                        Team Leader<span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          // width="250px"
                          onChange={handleTeamLeaderChange}
                          placeholder="Search by name"
                          value={teamLeaderValue}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-1-2">
                    <div>
                      <label htmlFor="issuedTime">
                        Please select your aligned KPI{" "}
                        <span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={measureOptions}
                          // width="250px"
                          onChange={handleMeasureChange}
                          placeholder="Select KPI"
                          value={jobCard.measure}
                          // required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-2">
                    <div>
                      <label className="uk-form-label" htmlFor="reworked">
                        Re-worked Job Card :
                        <span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <select
                          id="reworked"
                          className="uk-select"
                          value={reworked}
                          required
                          onChange={(e) => setReworked(e.target.value)}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </>

              <div className="uk-width-1-2 uk-margin">
                <div className="uk-margin">
                  <label htmlFor="issuedTime">
                    Select team Member(s){" "}
                    <span className="uk-text-danger">*</span>
                  </label>
                  <div className="uk-form-controls">
                    <Select
                      defaultValue={[]}
                      isMulti
                      name="colors"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleTeamMemberChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="uk-width-1-1">
                <h3>Material List</h3>
                {/* <MaterialsGrid data={materialList} jobCard={jobCard} /> */}
                <MaterialTable
                  materialList={currentMaterialList}
                  handleEdit={handleEdit}
                  onDeleteMaterial={onDeleteMaterial}
                  defaultPage={1} // Specify the default page number
                  defaultItemsPerPage={5} // Specify the default items per page
                />
                {!showMaterialForm && jobCard.isAllocated !== true && (
                  <div
                    className="uk-width-1-1 uk-text-right"
                    style={{ marginTop: "20px" }}>
                    <button
                      className="btn btn-primary uk-margin"
                      onClick={handleAddMaterialClick}>
                      <span>Add Material&nbsp;&nbsp;</span>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="icon uk-margin-small-right"
                      />
                    </button>
                  </div>
                )}
                {showEditMaterialForm && (
                  <div>
                    <h4>Edit Material Form</h4>
                    <div>
                      <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="materialName">
                          Material Name:
                        </label>
                        <input
                          type="text"
                          id="materialName"
                          name="name"
                          value={material.name}
                          onChange={(value) =>
                            handleMaterialNameChangeOnEdit(value)
                          }
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
                          value={material.unitCost}
                          onChange={(value) =>
                            handleUnitCostChangeOnEdit(value)
                          }
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
                          value={material.quantity}
                          onChange={(value) =>
                            handleQuantityChangeOnEdit(value)
                          }
                        />
                        {quantityErrorMessage && (
                          <div className="uk-alert-danger" data-uk-alert>
                            <p>{quantityErrorMessage}</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={onEditMaterial}
                        className="btn btn-primary">
                        Edit Material
                      </button>
                    </div>
                  </div>
                )}
                {showMaterialForm && (
                  <div>
                    <h4>Add New Material</h4>
                    <div>
                      <div className="uk-margin uk-width-1-1">
                        <label className="uk-form-label" htmlFor="materialName">
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

              <div className="uk-margin uk-width-1-1">
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
                  {jobCard.isAllocated !== true && (
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}>
                      Allocate
                      {loading && <div data-uk-spinner="ratio: .5"></div>}
                    </button>
                  )}
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
