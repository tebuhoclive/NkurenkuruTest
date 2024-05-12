import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import { ITask, defaultTask } from "../../shared/models/job-card-model/Task";
import { ITool, defaultTool } from "../../shared/models/job-card-model/Tool";
import logo from "../job-cards/images/logo512.png";
import {
  IMaterial,
  defaultMaterial,
} from "../../shared/models/job-card-model/Material";
import {
  IPrecaution,
  IStandard,
  defaultPrecaution,
  defaultStandard,
} from "../../shared/models/job-card-model/PrecautionAndStandard";
import {
  ILabour,
  defaultLabour,
} from "../../shared/models/job-card-model/Labour";
import {
  IOtherExpense,
  defaultOtherExpense,
} from "../../shared/models/job-card-model/OtherExpense";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import { useNavigate, useParams } from "react-router-dom";
import MODAL_NAMES from "../dialogs/ModalName";
import { hideModalFromId } from "../../shared/functions/ModalShow";
import {
  IClient,
  defaultClient,
} from "../../shared/models/job-card-model/Client";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { brandLogo } from "../../shared/functions/scorecard-pdf/ImageLoader";

const ViewJobCardModal = observer(() => {
  const [loading, setLoading] = useState(false);
  const { api, store, ui } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const users = store.user.all;

  //handle  tasks removal, addition,updating


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

  const materialList = store.jobcard.material.all;
  // Register fonts with pdfMake
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const exportToPDF = async () => {
    const dataURL = await getBase64ImageFromURL(logo);
    // Definition object for PDF content
    const title = "Nkurenkuru Town Cancel Job Card"; // Adjust the title as needed
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
          text: title,
          alignment: "center",
          margin: [0, 0, 20, 0], // Adjust margins as needed
        },
        {
          layout: "noBorders",
          margin: [0, 20, 0, 0], // Add top margin to the table
          table: {
            body: [
              ["Date Issued:", jobCard.dateIssued],
              ["Due Date:", jobCard.dueDate],
              ["Expected Outcomes:", jobCard.expectedOutcomes],
            ],
          },
        },
        {
          text: "Client Details (Optional)",
          style: "header",
        },
        {
          layout: "noBorders",
         
        },
        {
          text: "Allocation Section",
          style: "header",
        },
        {
          text: "Task List",
          style: "subheader",
        },
        {
          layout: "lightHorizontalLines",
         
        },
        {
          text: "Tool Description",
          style: "subheader",
        },
        // Add your code for toolList here
        {
          text: "Material Description",
          style: "subheader",
        },
        // Add your code for materialList here
        {
          text: "Precaution Description",
          style: "subheader",
        },
       
        {
          text: "Standard Description",
          style: "subheader",
        },
      
        {
          text: "Labour Assigned",
          style: "subheader",
        },
       
        {
          text: "Expenses",
          style: "subheader",
        },
      
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: false,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 10,
          bold: false,
          margin: [0, 10, 0, 5],
        },
      },
    };

    // Create PDF
    pdfMake.createPdf(docDefinition).download("job_card_details.pdf");
  };

  
const generatePDF = () => {
  const docDefinition : any= {
    content: [
      { text: "JOB CARD FOR MUNICIPAL SERVICES", style: "header" },
      {
        text: "(E.g Roads, water, sewerage reticulations/connections, and other repairs)",
        style: "italic",
      },
      { text: "Job Card Identifier: " + jobCard.uniqueId },
      { text: "Date and Time logged: " + jobCard.dateIssued },
      {
        columns: [
          {
            width: "50%",
            text: [
              { text: "Division: ", bold: true },
              jobCard.division,
              "\n",
              { text: "Assign To: ", bold: true },
              users.find((user) => user.asJson.uid === jobCard.assignedTo)?.asJson
                .displayName || "",
              "\n",
              { text: "Urgency: ", bold: true },
              jobCard.urgency,
              "\n",
              // Add more fields as needed
            ],
          },
          {
            width: "50%",
            text: [
              { text: "Client Details:", bold: true },
              "\n",
              { text: "Full Names: ", bold: true },
              jobCard.clientFullName,
              "\n",
              { text: "Email: ", bold: true },
              jobCard.clientEmail,
              "\n",
              { text: "Cellphone: ", bold: true },
              jobCard.clientMobileNumber,
              "\n",
              // Add more client details as needed
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: "50%",
            text: [
              { text: "Start Date: ", bold: true },
              jobCard.dateIssued,
              "\n",
              { text: "Issued Time: ", bold: true },
              jobCard.dueDate,
              "\n",
              // Add more fields as needed
            ],
          },
          {
            width: "50%",
            text: [
              { text: "Team Leader: ", bold: true },
              users.find((user) => user.asJson.uid === jobCard.teamLeader)?.asJson
                .displayName || "",
              "\n",
              { text: "Artesian: ", bold: true },
              users.find((user) => user.asJson.uid === jobCard.artesian)?.asJson
                .displayName || "",
              "\n",
              { text: "Team Member: ", bold: true },
              users.find((user) => user.asJson.uid === jobCard.teamMember)?.asJson
                .displayName || "",
              "\n",
              { text: "KPI?Measure: ", bold: true },
              jobCard.measure,
              "\n",
              // Add more details as needed
            ],
          },
        ],
      },
      {
        text: "Material List",
        style: "header",
      },
      // Add material list here
      { ul: materialList.map((material) => material.name) },
      {
        text: "Remarks: " + jobCard.remark,
        style: "remarks",
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

  //handle materials

  const onCancel = () => {
    store.jobcard.jobcard.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  };

  useEffect(() => {
    if (store.jobcard.jobcard.selected) {
      setJobCard(store.jobcard.jobcard.selected);
    }
  }, [store.jobcard.jobcard.selected]);

  // useEffect(() => {
  //   if (store.jobcard.jobcard.selected) {
  //     const loadData = async () => {
  //       try {
  //         // Fetch job card details
  //         const jobCardDetails = await api.jobcard.jobcard.getAll();
  //         // Assuming jobCardDetails is an array of job card objects, choose one based on your logic
  //         const selectedJobCard = store.jobcard.jobcard.selected;

  //         if (selectedJobCard) {
  //           // Fetch data for subcollections
  //           await api.jobcard.task.getAll(selectedJobCard.id);
  //           await api.jobcard.client.getAll(selectedJobCard.id);
  //           await api.jobcard.tool.getAll(selectedJobCard.id);
  //           await api.jobcard.labour.getAll(selectedJobCard.id);
  //           await api.jobcard.material.getAll(selectedJobCard.id);
  //           await api.jobcard.otherExpense.getAll(selectedJobCard.id);
  //           await api.jobcard.standard.getAll(selectedJobCard.id);
  //           await api.jobcard.precaution.getAll(selectedJobCard.id);
  //         } else {
  //           console.error("Job card not found.");
  //         }
  //       } catch (error) {
  //         console.error("Error loading data:", error);
  //       }
  //     };

  //     loadData();
  //   }
  // }, [
  //   api.jobcard.jobcard,
  //   api.jobcard.task,
  //   api.jobcard.client,
  //   api.jobcard.labour,
  //   jobId,
  //   store.jobcard.jobcard.selected,
  //   api.jobcard.tool,
  //   api.jobcard.material,
  //   api.jobcard.otherExpense,
  //   api.jobcard.standard,
  //   api.jobcard.precaution,
  //   jobCard.id,
  // ]);
 useEffect(() => {
   if (store.jobcard.jobcard.selected) {
     const loadData = async () => {
       await api.user.getAll();
       await api.measure.getAll();
     };

     loadData();
   }
 }, [
   api.jobcard.jobcard,
   store.jobcard.jobcard.selected,
   api.jobcard.material,
   api.user,
   api.measure,
 ]);

  return (
    <div
      className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "60%" }}>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close></button>

      <h3 className="uk-modal-title text-to-break">View Job Card Details</h3>
      <div className="dialog-content uk-position-relative">
        {/* Add create Section */}
        <div className="dialog-content uk-position-relative ">
          <div className="uk-flex-column">
            <div className="uk-grid uk-child-width-1-3@s" data-uk-grid>
              {/* First Column */}
              <div>
                <div className="uk-margin">
                  <p className="uk-form-label">Assigned to:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">
                      {
                        users.find(
                          (user) => user.asJson.uid === jobCard.assignedTo
                        )?.asJson.displayName
                      }
                    </p>
                  </div>
                </div>
                <div className="uk-margin">
                  <p className="uk-form-label">Artesian :</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">
                      {
                        users.find(
                          (user) => user.asJson.uid === jobCard.artesian
                        )?.asJson.displayName
                      }
                    </p>
                  </div>
                </div>
                <div className="uk-margin">
                  <p className="uk-form-label">Team Leader :</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">
                      {
                        users.find(
                          (user) => user.asJson.uid === jobCard.teamLeader
                        )?.asJson.displayName
                      }
                    </p>
                  </div>
                </div>
                <div className="uk-margin">
                  <p className="uk-form-label">Team Member:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">
                      {
                        users.find(
                          (user) => user.asJson.uid === jobCard.teamMember
                        )?.asJson.displayName
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Column */}
              <div>
                <div className="uk-margin">
                  <p className="uk-form-label">Division:*</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.division}</p>
                  </div>
                </div>
                <div className="uk-margin">
                  <p className="uk-form-label">Urgency:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.urgency}</p>
                  </div>
                </div>
              </div>

              {/* Third Column */}
              <div>
                <div className="uk-margin">
                  <p className="uk-form-label">Date Issued:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.dateIssued}</p>
                  </div>
                </div>
                <div className="uk-margin">
                  <p className="uk-form-label">Due Date:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.dueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/*Client Details */}
            <div>
              <h3>Client Details</h3>

              <div className="uk-flex-column">
                <div className="uk-margin">
                  <label className="uk-form-label">Client Name:</label>
                  <div className="uk-form-controls">
                    {jobCard.clientFullName}
                  </div>
                </div>
                <div className="uk-flex">
                  <div className="uk-margin" style={{ width: "50%" }}>
                    <label className="uk-form-label">Telephone Number:</label>
                    <div className="uk-form-controls">
                      {jobCard.clientTelephone}
                    </div>
                  </div>
                  <div className="uk-margin" style={{ width: "50%" }}>
                    <label className="uk-form-label">Mobile Number:</label>
                    <div className="uk-form-controls">
                      {jobCard.clientMobileNumber}
                    </div>
                  </div>
                </div>
                <div className="uk-flex">
                  <div className="uk-margin" style={{ width: "50%" }}>
                    <label className="uk-form-label">Email:</label>
                    <div className="uk-form-controls">
                      {jobCard.clientEmail}
                    </div>
                  </div>
                  <div className="uk-margin" style={{ width: "50%" }}>
                    <label className="uk-form-label">Address:</label>
                    <div className="uk-form-controls">
                      {jobCard.clientAddress}
                    </div>
                  </div>
                </div>
                <div className="uk-flex">
                  <div className="uk-margin" style={{ width: "50%" }}>
                    <label className="uk-form-label">erf:</label>
                    <div className="uk-form-controls">{jobCard.erf}</div>
                  </div>
                  <div className="uk-margin" style={{ width: "50%" }}>
                    <label className="uk-form-label">Type of work:</label>
                    <div className="uk-form-controls">{jobCard.typeOfWork}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2>Allocation</h2>
        </div>

        <div>
          <h3>Material Description</h3>
          <p>View Material type and description.</p>

          {/* Your HTML for displaying materials */}
          <table className="uk-table uk-table-divider">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              {materialList.map((material) => (
                <tr key={material.id}>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unitCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="uk-width-1-1 uk-text-right"
          style={{ marginTop: "20px" }}>
          <div
            className="uk-width-1-1 uk-text-right"
            style={{ marginTop: "10px" }}>
            <button
              onClick={generatePDF}
              className="btn btn-primary uk-button-danger"
              style={{ marginRight: "10px" }}>
              Export to PDF
            </button>

            <button
              className="btn btn-primary"
              type="button"
              disabled={loading}
              onClick={onCancel}>
              Close {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ViewJobCardModal;
