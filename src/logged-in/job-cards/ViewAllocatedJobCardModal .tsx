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

  const handleArtesianChange = (value: string) => {
    setArtesianValue(value);
    setJobCard({ ...jobCard, artesian: value });
    // Additional logic if needed
  };
  const handleTeamLeaderChange = (value: string) => {
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

  const currentMeasure = store.measure;
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
            widths: ["30%", "40%", "30%"], // Adjust column widths as needed
            body: [
              [
                { text: "Quantity", bold: true },
                { text: "Name", bold: true },
                { text: "Unit Cost", bold: true },
              ],
              ...materialList.map((material) => [
                material.quantity,
                material.name,
                `N$${material.unitCost}`, // Add "N$" to the unit cost price
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

  const handleDeleteJobCard = async () => {
    try {
      const id = jobCard.id;
      if (id) {
        await api.jobcard.jobcard.delete(id);
      }
      onCancel();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleMarkAsCompleted = async () => {
    const UpdateJobCard: IJobCard = { ...jobCard, status: "Completed" };

    try {
      await api.jobcard.jobcard.update(UpdateJobCard);
      console.log("Completed", UpdateJobCard);
    } finally {
      onCancel();
    }
  };
  const showOptionsColumn = true; // Set this to false to hide the Options column

  const [reworked, setReworked] = useState("No");

  // code for adding material
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

  function handleOnEditJobCard(): void {
    throw new Error("Function not implemented.");
  }

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
        {/* <h3 className="main-title-small text-to-break">
          {" "}
          Job Card Allocation view
        </h3> */}
        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          Allocated Job Card Form
        </span>
        <hr />

        <div className="dialog-content uk-position-relative uk-width-1-1">
          <h4 className="uk-text-bold">Job Card Management and allocation</h4>

          <hr />
          <form
            className="uk-form uk-grid uk-grid-small"
            onSubmit={handleSubmit}>
            <>
              <div className="uk-width-1-2">
                {jobCard && (
                  <div className="uk-width-1-1 ">
                    <h4 style={{ fontWeight: "bold" }}>Job Card Details</h4>

                    <div className="uk-grid uk-grid-small" data-uk-grid>
                     
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
                      <div className="uk-width-1-3">
                        <p>Due Date:</p>
                      </div>
                      <div className="uk-width-1-1">
                        <p>{jobCard.dueDate}</p>
                      </div>
                      <hr className="uk-width-1-1" />
                    </div>
                  </div>
                )}
              </div>

              <div className="uk-width-1-2 ">
                <h4 style={{ fontWeight: "bold" }}>Team Details</h4>
                <div
                  className="uk-grid uk-grid-small uk-margin-left"
                  data-uk-grid>
                  <div className="uk-width-1-3">
                    <p>Assigned To:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getDisplayName(jobCard.teamLeader)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Team Leader:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getDepartmentName(jobCard.section)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Artesian</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getBusinessUnitName(jobCard.division)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Artesian</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.urgency}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Member (s).</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.uniqueId}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                </div>
              </div>
              {jobCard && (
                <div className="uk-width-1-2 uk-margin-large-top">
                  <h4 style={{ fontWeight: "bold" }}>
                    Job Card Client Details
                  </h4>

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
            </>

            <div className="uk-width-1-1">
              <h3>Material List</h3>
              {/* <MaterialsGrid data={materialList} jobCard={jobCard} /> */}
              <MaterialTable
                materialList={materialList}
                handleEdit={handleEdit}
                onDeleteMaterial={onDeleteMaterial}
                showActions={false}
                showPagination={false} // Pass showActions prop with value false to hide the Actions column
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
                    {jobCard.status !== "Completed" && (
                      <>
                        <button
                          className="btn btn-primary uk-margin-right"
                          type="button"
                          disabled={loading}
                          onClick={handleOnEditJobCard}>
                          Edit Job Card{" "}
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
                      </>
                    )}

                    {/* <button
                        className="btn btn-primary"
                        type="button"
                        disabled={loading}
                        onClick={handleFeedbackAndComments}>
                        Feedback & Comments{" "}
                        {loading && <div data-uk-spinner="ratio: .5"></div>}
                      </button> */}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default ViewAllocatedJobCardModal;
