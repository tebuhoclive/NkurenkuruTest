// Step2.tsx
// UpdateJobCard.tsx
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useAppContext } from "../../shared/functions/Context";
import logo from "../job-cards/images/logo512.png";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId, {
  hideModalFromId,
} from "../../shared/functions/ModalShow";
import {
  IJobCard,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect, {
  IOption,
} from "../../shared/components/single-select/SingleSelect";
import NumberInput from "../shared/components/number-input/NumberInput";
import {
  IMaterial,
  defaultMaterial,
} from "../../shared/models/job-card-model/Material";

import MaterialTable from "./grids/MaterialTable";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
const ViewAllocatedJobCardModal = observer(() => {
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
  // const handleTeamMemberChange = (value) => {
  //   setTeamMemberValue(value);
  //   setJobCard({ ...jobCard, teamMember: value });
  //   // Additional logic if needed
  // };
  const handleTeamMemberChange = (selectedOptions) => {
    // selectedOptions is an array containing the selected option objects
    // You can access the selected values and perform any necessary actions

    // For example, you can extract the selected values and store them in state
    const selectedValues = selectedOptions.map((option) => option.value);
    console.log(selectedValues); // Assuming setTeamMembers is a state update function
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
  // const measureOptions: IOption[] = useMemo(
  //   () =>
  //     measure.map((measure) => {
  //       return {
  //         label: measure.asJson.description || "",
  //         value: measure.asJson.uid,
  //       };
  //     }),
  //   [measure]
  // );

  const staticMeasures = [
    { label: "Measure 1", value: "measure1" },
    { label: "Measure 2", value: "measure2" },
    { label: "Measure 3", value: "measure3" },
    // Add more measures as needed
  ];

  const measureOptions: IOption[] = useMemo(
    () =>
      staticMeasures.map((measure) => {
        return {
          label: measure.label,
          value: measure.value,
        };
      }),
    [] // No dependencies since staticMeasures is not expected to change
  );

const currentMeasure=store.measure
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
      const updatedJobCard = {
        ...jobCard,
        isAllocated: true,
        jobcardCost: totalMaterialCost,
      };

      // Call the API to update the job card with the updated object
      await api.jobcard.jobcard.update(updatedJobCard);
      console.log("jobcard", updatedJobCard);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error submitting form:", error);
    } finally {
      onCancel();
      setLoading(false);
    }
  };

  // Function to get base64 image from URL
  const getBase64ImageFromURL = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  };

  // Register fonts with pdfMake
  pdfMake.vfs = pdfFonts.pdfMake.vfs;



  const generatePDF = async () => {
    const dataURL = await getBase64ImageFromURL(logo);
    const docDefinition: any = {
      content: [
        {
          columns: [
            {
              image: dataURL,
              fit: [100, 100], // Adjust fit as needed
              alignment: "center",
            },
          ],
        },
        { text: "JOB CARD FOR MUNICIPAL SERVICES", style: "header" },
        {
          text: "(E.g Roads, water, sewerage reticulations/connections, and other repairs)",
          style: "italic",
        },

        {
          columns: [
            { text: "Job Card Details: " + jobCard.uniqueId },
            { text: "Date and Time logged: " + jobCard.dateIssued },
          ],
        },
        "\n",
        {
          columns: [
            {
              table: {
                widths: ["30%", "70%"],
                body: [
                  [
                    { text: "Assigned To:", bold: true },
                    getDisplayName(jobCard.assignedTo),
                  ],
                  [{ text: "Section:", bold: true }, jobCard.section],
                  [{ text: "Division:", bold: true }, jobCard.division],
                  [{ text: "Urgency:", bold: true }, jobCard.urgency],
                  [{ text: "Unique ID:", bold: true }, jobCard.uniqueId],
                  [
                    { text: "Task Description:", bold: true },
                    jobCard.taskDescription,
                  ],
                  [{ text: "Due Date:", bold: true }, jobCard.dueDate],
                ],
              },
            },
          ],
        },
        "\n",
        { text: "Client Details: " },
        {
          table: {
            widths: ["30%", "70%"],
            body: [
              [{ text: "Full Name:", bold: true }, jobCard.clientFullName],
              [{ text: "Address:", bold: true }, jobCard.clientAddress],
              [{ text: "Phone No.:", bold: true }, jobCard.clientMobileNumber],
              [{ text: "Email:", bold: true }, jobCard.clientEmail],
            ],
          },
        },
        "\n",
        { text: "Team Details: " },
        {
          columns: [
            {
              table: {
                widths: ["30%", "70%"],
                body: [
                  [
                    { text: "Team Leader:", bold: true },
                    getDisplayName(jobCard.teamLeader),
                  ],
                  [
                    { text: "Artesian:", bold: true },
                    getDisplayName(jobCard.artesian),
                  ],
                  [
                    { text: "Team Members:", bold: true },
                    {
                      ul: jobCard.teamMembers.map((member) =>
                        getDisplayName(member)
                      ),
                    },
                  ],
                  [{ text: "KPI Measure:", bold: true }, jobCard.measure],
                  // Add more rows as needed
                ],
              },
            },
          ],
        },

        {
          text: "Material List",
        },
        "\n",
        // Add material list here
        {
          table: {
            widths: ["auto", "*", "auto"], // Adjust column widths as needed
            body: [
              [
                { text: "Quantity", bold: true },
                { text: "Name", bold: true },
                { text: "Unit Cost", bold: true },
              ],
              ...materialList.map((material) => [
                material.quantity,
                material.name,
                material.unitCost,
              ]),
            ],
          },
        },

        
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        italic: {
          fontStyle: "italic",
          margin: [0, 0, 0, 10],
        },
        remarks: {
          margin: [0, 10, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("job_card.pdf");
  };

  const onCancel = () => {
    store.jobcard.jobcard.clearSelected();
    store.jobcard.material.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.VIEWALLOCATEDJOBCARD_MODAL);
  };

  // code for adding material
  const [showMaterialForm, setShowMaterialForm] = useState(false);
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

    try {
      // Create the material on the server
      const id = jobCard.id;
      await api.jobcard.material.create(
        newMaterial,
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
      onCancel();
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

  const onDeleteMaterial = async (materialId: string) => {
    try {
      // Delete the material on the server
      await api.jobcard.material.delete(materialId, jobCard.id);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleEdit = async (materialId: string) => {
    if (materialId) {
      const currentMaterial = store.jobcard.material.getById(materialId);
      store.jobcard.material.select(currentMaterial);
      store.jobcard.jobcard.select(jobCard);
    }
    try {
      showModalFromId(MODAL_NAMES.EXECUTION.ONEDITMATERIAL_MODAL);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleExportToPDF = () => {
    // Your logic for exporting to PDF goes here
  };

  const handleDeleteJobCard = () => {
    // Your logic for deleting the job card goes here
  };

  const handleMarkAsCompleted = () => {
    // Your logic for marking the job card as completed goes here
  };

  const handleFeedbackAndComments = () => {
    // Your logic for handling feedback and comments goes here
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
        <h3 className="main-title-small text-to-break">
          {" "}
          Job Card Allocation view
        </h3>
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
                    <p>{jobCard.dueDate}</p>
                  </div>
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
              className="uk-margin"
              style={{ justifyContent: "center" }}
              onSubmit={handleSubmit}>
              <>
                <div className="uk-grid">
                  <div className="uk-width-1-3">
                    <div>
                      <label htmlFor="issuedDate">
                        Artesian<span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          width="250px"
                          onChange={handleArtesianChange}
                          placeholder="Search by name"
                          value={artesianValue}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-1-3">
                    <div>
                      <label htmlFor="issuedTime">
                        Team Leader<span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={options}
                          width="250px"
                          onChange={handleTeamLeaderChange}
                          placeholder="Search by name"
                          value={teamLeaderValue}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="uk-width-1-3">
                    <div>
                      <label htmlFor="issuedTime">
                        Please select your aligned KPI{" "}
                        <span className="uk-text-danger">*</span>
                      </label>
                      <div className="uk-form-controls">
                        <SingleSelect
                          name="search-team"
                          options={measureOptions}
                          width="250px"
                          onChange={handleMeasureChange}
                          placeholder="Select KPI"
                          value={jobCard.measure}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>

              <div className="uk-width-1-2 uk-margin">
                <div className="uk-margin">
                  <label htmlFor="issuedTime">
                    Select team Member(s)
                    <span className="uk-text-danger">*</span>
                  </label>
                  <div className="uk-form-controls">
                    {/* <SingleSelect
                          name="search-team"
                          options={options}
                          width="250px"
                          onChange={handleTeamMemberChange}
                          placeholder="Search by name"
                          value={teamMemberValue}
                        /> */}
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

              <div className="uk-grid">
                <div className="uk-width-1-1">
                  {currentMaterialList.length !== 0 && (
                    <>
                      {" "}
                      <h3>Material List</h3>
                      <MaterialTable
                        materialList={currentMaterialList}
                        handleEdit={handleEdit}
                        onDeleteMaterial={onDeleteMaterial}
                        defaultPage={1} // Specify the default page number
                        defaultItemsPerPage={5} // Specify the default items per page
                      />
                    </>
                  )}

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
                            className="uk-input"
                          />
                        </div>
                        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                          <label
                            className="uk-form-label required"
                            htmlFor="amount">
                            Cost Amount (min N$ cannot be less than 0)
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
                  {jobCard.isAllocated !== true && (
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}>
                      Allocate
                      {loading && <div data-uk-spinner="ratio: .5"></div>}
                    </button>
                  )}

                  {jobCard.isAllocated === true && (
                    <div
                      className="uk-width-1-1 uk-text-right"
                      style={{ marginTop: "100px" }}>
                      <button
                        className="btn btn-primary uk-margin-right"
                        type="button"
                        disabled={loading}
                        onClick={generatePDF}>
                        Exported to pdf{" "}
                        {loading && <div data-uk-spinner="ratio: .5"></div>}
                      </button>
                      <button
                        className="btn btn-primary uk-margin-right"
                        type="button"
                        disabled={loading}
                        onClick={handleDeleteJobCard}>
                        Delete Job Card{" "}
                        {loading && <div data-uk-spinner="ratio: .5"></div>}
                      </button>
                      <button
                        className="btn btn-primary uk-margin-right"
                        type="button"
                        disabled={loading}
                        onClick={handleMarkAsCompleted}>
                        Mark As completed{" "}
                        {loading && <div data-uk-spinner="ratio: .5"></div>}
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={loading}
                        onClick={handleFeedbackAndComments}>
                        Feedback & Comments{" "}
                        {loading && <div data-uk-spinner="ratio: .5"></div>}
                      </button>
                    </div>
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

export default ViewAllocatedJobCardModal;
