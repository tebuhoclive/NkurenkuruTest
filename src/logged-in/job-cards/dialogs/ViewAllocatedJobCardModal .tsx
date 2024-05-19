// Step2.tsx
// UpdateJobCard.tsx
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import logo from "../images/logo512.png"
import MODAL_NAMES from "../../dialogs/ModalName";
import showModalFromId, {
  hideModalFromId,
} from "../../../shared/functions/ModalShow";
import {
  IJobCard,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

import MaterialTable from "../grids/MaterialTable";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { dateFormat_YY_MM_DD } from "../../shared/utils/utils";
import { IClient, defaultClient } from "../../../shared/models/job-card-model/Client";
const ViewAllocatedJobCardModal = observer(() => {
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const [client, setClient] = useState<IClient>({ ...defaultClient });

  // Additional state or logic specific to Step 2

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();



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

  //Kpi measures here
  const measure = store.measure.getByUid(jobCard.teamLeader);
  console.log("all me in measures", measure);
  const materialCost = store.jobcard.material.all;

  //calculate material cost

  // Calculate the total material cost
  const totalMaterialCost = materialCost.reduce((total, material) => {
    return total + material.asJson.unitCost;
  }, 0);

  const users = store.user.all;



  const currentMeasure = store.measure;

   const materialList = store.jobcard.material.all.map(
     (material) => material.asJson
   );
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
       {
         text: "JOB CARD FOR MUNICIPAL SERVICES",
         style: "header",
         fontSize: 10,
       },
       {
         text: "(E.g Roads, water, sewerage reticulations/connections, and other repairs)",
         style: "italic",
         fontSize: 10,
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
                   { text: "Assigned To:", fontSize: 9 },
                   { text: getDisplayName(jobCard.assignedTo), fontSize: 9 },
                 ],
                 [
                   { text: "Section:", fontSize: 9 },
                   { text: getDepartmentName(jobCard.section), fontSize: 9 },
                 ],
                 [
                   { text: "Division:", fontSize: 9 },
                   { text: getBusinessUnitName(jobCard.division), fontSize: 9 },
                 ],
                 [
                   { text: "Urgency:", fontSize: 9 },
                   { text: jobCard.urgency, fontSize: 9 },
                 ],
                 [
                   { text: "Unique ID:", fontSize: 9 },
                   { text: jobCard.uniqueId, fontSize: 9 },
                 ],
                 [
                   { text: "Task Description:", fontSize: 9 },
                   { text: jobCard.taskDescription, fontSize: 9 },
                 ],
                 [
                   { text: "Due Date:", fontSize: 9 },
                   { text: dateFormat_YY_MM_DD(jobCard.dueDate), fontSize: 9 },
                 ],
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
             [
               { text: "Full Name:", fontSize: 9 },
               { text: jobCard.clientFullName, fontSize: 9 },
             ],
             [
               { text: "Address:", fontSize: 9 },
               { text: jobCard.clientAddress, fontSize: 9 },
             ],
             [
               { text: "Phone No.:", fontSize: 9 },
               { text: jobCard.clientMobileNumber, fontSize: 9 },
             ],
             [
               { text: "Email:", fontSize: 9 },
               { text: jobCard.clientEmail, fontSize: 9 },
             ],
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
                   { text: "Team Leader:", fontSize: 9 }, // Adjust font size
                   getDisplayName(jobCard.teamLeader),
                 ],
                 [
                   { text: "Artesian:", fontSize: 9 }, // Adjust font size
                   getDisplayName(jobCard.artesian),
                 ],
                 [
                   { text: "Team Members:", fontSize: 9 }, // Adjust font size
                   {
                     ul: jobCard.teamMembers.map((member) =>
                       getDisplayName(member)
                     ),
                   },
                 ],
                 [{ text: "KPI Measure:", fontSize: 9 }, jobCard.measure], // Adjust font size
                 // Add more rows as needed
               ],
             },
             fontSize: 8, // Adjust overall font size
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
           headerRows: 1,
           widths: ["30%", "40%", "30%"], // Adjust column widths as needed
           body: [
             [
               { text: "Quantity", style: "tableHeader", fontSize: 9 },
               { text: "Name", style: "tableHeader", fontSize: 9 },
               { text: "Unit Cost", style: "tableHeader", fontSize: 9 },
             ],
             ...currentMaterialList.map((material) => [
               material.quantity,
               material.name,
               { text: `N$${material.unitCost}`, alignment: "right" }, // Add "N$" to the unit cost price
             ]),
           ],
         },
         layout: {
           fillColor: "#fff", // Background color for the table cells
           hLineWidth: () => 0.1, // Adjust the thickness of horizontal lines
           vLineWidth: () => 0.1, // Adjust the thickness of vertical lines
         },
         margin: [0, 10, 0, 10],
         fontSize: 8,
         style: "table",
       },
     ],
     styles: {
       header: {
         fontSize: 10,
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
       tableHeader: {
         bold: true,
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

  const handleAddMaterialClick = () => {
    setShowMaterialForm(true);
  };

  // Function to handle changes for Material Name


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
      const currentMaterial = store.jobcard.material.getById(materialId).asJson;
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
     // Confirm deletion with the user
     const confirmDelete = window.confirm(
       "Are you sure you want to delete this job card?"
     );

     if (confirmDelete) {
       // Proceed with deletion if user confirms
       const updated: IJobCard = { ...jobCard, status: "Deleted" };
       if (jobCard) {
         await api.jobcard.jobcard.update(updated);
       }
       onCancel();
     }
   } catch (error) {
     console.error("Error deleting material:", error);
   }
 };

  const handleMarkAsCompleted = async () => {
    const UpdateJobCard: IJobCard = { ...jobCard, status: "Completed",dateCompleted: Date.now() };

    try {
      await api.jobcard.jobcard.update(UpdateJobCard);
      console.log("Completed", UpdateJobCard);
    } finally {
      onCancel();
    }
  };


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

        if (jobCard.clientId) {
          const selectedClient = store.jobcard.client.getById(jobCard.clientId);
          if (selectedClient) {
            setClient(selectedClient.asJson);
          }
        }
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
  }, [api.user, api.jobcard, api.department, store.jobcard.jobcard.selected, api.measure, jobCard, store.jobcard.client]);



   const handleOnEditJobCard = () => {

    
     store.jobcard.jobcard.select(jobCard);

     showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
   };
    //  const getBusinessUnitName = (businessId) => {
    //    const unit = store.businessUnit.all.find(
    //      (unit) => unit.asJson.id === businessId
    //    );
    //    return unit ? unit.asJson.name : "Unknown";
    //  };

    //  const getDepartmentName = (deptId) => {
    //    const dept = store.department.all.find(
    //      (user) => user.asJson.id === deptId
    //    );
    //    return dept ? dept.asJson.name : "Unknown";
    //  };

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
          <h4 className="uk-text-bold"> </h4>

          <form
            className="uk-form uk-grid uk-grid-small"
            onSubmit={handleSubmit}>
            <>
              <div className="uk-width-1-2">
                {jobCard && (
                  <div className="uk-width-1-1 ">
                    <h4 style={{ fontWeight: "bold" }}>Job Card Details</h4>

                    <div className="uk-grid uk-grid-small" data-uk-grid>
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
                      <div className="uk-width-1-3">
                        <p>{dateFormat_YY_MM_DD(jobCard.dueDate)}</p>
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
                    <p>{getDisplayName(jobCard.teamLeader)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Artesian</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getDisplayName(jobCard.artesian)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Member(s)</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>
                      {jobCard.teamMembers
                        .map((id) => getDisplayName(id))
                        .join(", ")}
                    </p>
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
                      <p>{client.name}</p>
                    </div>
                    <hr className="uk-width-1-1" />

                    <div className="uk-width-1-3">
                      <p>Address :</p>
                    </div>
                    <div className="uk-width-2-3">
                      <p>{client.physicalAddress}</p>
                    </div>
                    <hr className="uk-width-1-1" />

                    <div className="uk-width-1-3">
                      <p>Phone No.</p>
                    </div>
                    <div className="uk-width-2-3">
                      <p>{client.mobileNumber}</p>
                    </div>
                    <hr className="uk-width-1-1" />

                    <div className="uk-width-1-3">
                      <p>Email</p>
                    </div>
                    <div className="uk-width-2-3">
                      <p>{client.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </>

            <div className="uk-width-1-2">
              <h3 style={{ fontWeight: "bold" }}>Material List</h3>
              {/* <MaterialsGrid data={materialList} jobCard={jobCard} /> */}
              <MaterialTable
                materialList={currentMaterialList}
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
                {jobCard.isAllocated === true &&
                  jobCard.status !== "Deleted" && (
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
                            className="btn btn-primary uk-button-danger uk-margin-right"
                            type="button"
                            disabled={loading}
                            onClick={handleDeleteJobCard}>
                            Delete Job Card
                            {loading && (
                              <div data-uk-spinner="ratio: 0.5"></div>
                            )}
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
