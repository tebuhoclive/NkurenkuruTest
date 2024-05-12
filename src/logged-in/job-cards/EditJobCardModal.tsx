import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import { useNavigate, useParams } from "react-router-dom";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId, {
  hideModalFromId,
} from "../../shared/functions/ModalShow";
import {
  IClient,
  defaultClient,
} from "../../shared/models/job-card-model/Client";

import SingleSelect, {
  IOption,
} from "../../shared/components/single-select/SingleSelect";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";


const EditJobCardModal = observer(() => {
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

  const navigate = useNavigate();
  const [artesianValue, setArtesianValue] = useState(""); // State for Artesian input
  const [teamLeaderValue, setTeamLeaderValue] = useState(""); // State for Team Leader input
  const [teamMemberValue, setTeamMemberValue] = useState(""); // State for Team Member input

  // Additional state or logic specific to Step 2


  //handle  tasks removal, addition,updating
  const [selectedUser, setSelectedUser] = useState(jobCard.assignedTo);

  const materialList = store.jobcard.material.all;
  const measure = store.measure.getByUid(teamLeaderValue);
  console.log("all me in measures", measure);

  const measuresOptions = measure.map((item) => ({
    label: item.asJson.description, // Assuming each measure object has a 'name' property
    value: item.asJson.id, // Assuming each measure object has a 'uid' property
  }));

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
  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUser(selectedUserId);
    // Perform additional actions if needed, such as updating jobCard state
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.jobcard.jobcard.update(jobCard);

      // navigate(`/c/job-cards/update/${id}`);
    } catch (error) {
      // Handle error appropriately
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Make sure to reset loading state regardless of success or failure
      onCancel();
    }
  };
  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobCard({
      ...jobCard,
      urgency: e.target.value as IUrgency,
    });
  };
  const onView = () => {
    store.jobcard.jobcard.select(jobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ADDJOBCARDMATERIAL_MODAL);
  };
  const onCancel = () => {
    store.jobcard.jobcard.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  };

  const handleMeasureChange = (event) => {
    const selectedMeasureId = event.target.value;
    setJobCard({ ...jobCard, measure: selectedMeasureId });
    // Perform additional actions if needed
  };

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

  useEffect(() => {
    if (store.jobcard.jobcard.selected) {
   

      setJobCard(store.jobcard.jobcard.selected);
    }
  }, [store.jobcard.client, store.jobcard.jobcard.selected]);

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
    // <ErrorBoundary>
    //   <div
    //     className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
    //     style={{ width: "60%" }}>
    //     {" "}
    //     <button
    //       className="uk-modal-close-default"
    //       type="button"
    //       data-uk-close></button>
    //     <div className="uk-flex" style={{ justifyContent: "center" }}>
    //       <form
    //         className="review-info uk-card uk-card-default uk-card-body uk-card-small "
    //         style={{ width: "100%", justifyContent: "center" }}
    //         onSubmit={handleSubmit}>
    //         {/*Heading*/}
    //         <div style={{ textAlign: "center" }}>
    //           <h2>JOB CARD FOR MUNICIPAL SERVICES</h2>
    //           <p style={{ fontStyle: "italic" }}>
    //             (E.g Roads, water, sewerage reticulations/connections, and other
    //             repairs)
    //           </p>
    //           <div className="uk-flex uk-flex-between uk-flex-middle">
    //             <p className="text-to-break">
    //               Job Card Identifier: {jobCard.uniqueId}
    //             </p>
    //             <p>Date and Time logged: {jobCard.dateIssued}</p>
    //           </div>
    //         </div>
    //         <div className="uk-grid uk-child-width-1-2@s" data-uk-grid>
    //           <div>
    //             <div className="uk-margin">
    //               <input
    //                 type="text"
    //                 id="objectives"
    //                 placeholder="Division"
    //                 value={jobCard.division}
    //                 onChange={(e) =>
    //                   setJobCard({
    //                     ...jobCard,
    //                     division: e.target.value,
    //                   })
    //                 }
    //               />
    //             </div>
    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="assignTo">
    //                 Assign To
    //               </label>
    //               <div className="uk-form-controls">
    //                 <select
    //                   className="uk-select uk-form-small"
    //                   id="assignTo"
    //                   value={jobCard.assignedTo}
    //                   onChange={handleUserChange}
    //                   required>
    //                   <option value="">Assign to</option>{" "}
    //                   {/* Placeholder option */}
    //                   {users.map((user) => (
    //                     <option key={user.asJson.uid} value={user.asJson.uid}>
    //                       {user.asJson.displayName}
    //                     </option>
    //                   ))}
    //                 </select>
    //               </div>
    //             </div>
    //           </div>
    //           <div>
    //             <div className="uk-margin">
    //               <input
    //                 type="text"
    //                 id="objectives"
    //                 placeholder="Section"
    //                 value={jobCard.section}
    //                 onChange={(e) =>
    //                   setJobCard({
    //                     ...jobCard,
    //                     section: e.target.value,
    //                   })
    //                 }
    //               />
    //             </div>

    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="urgency">
    //                 Urgency:
    //               </label>
    //               <div className="uk-form-controls">
    //                 <select
    //                   className="uk-select uk-form-small"
    //                   id="urgency"
    //                   value={jobCard.urgency}
    //                   onChange={handleUrgencyChange}
    //                   required>
    //                   <option value="Normal">Normal</option>
    //                   <option value="Urgent">Urgent</option>
    //                   <option value="Very Urgent">Very Urgent</option>
    //                 </select>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           {" "}
    //           <p>Client Details.</p>
    //         </div>
    //         <div className="uk-grid uk-child-width-1-2@s" data-uk-grid>
    //           <div>
    //             {/* Content for the first column */}

    //             <div className="uk-margin">
    //               <input
    //                 type="text"
    //                 id="objectives"
    //                 placeholder="Full Names"
    //                 value={jobCard.clientFullName}
    //                 onChange={(e) =>
    //                   setJobCard({
    //                     ...jobCard,
    //                     clientFullName: e.target.value,
    //                   })
    //                 }
    //               />
    //             </div>
    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="client-location">
    //                 Email:
    //               </label>
    //               <div className="uk-form-controls">
    //                 <input
    //                   className="uk-input uk-form-small"
    //                   type="text"
    //                   id="client-location"
    //                   placeholder="Address"
    //                   value={jobCard.clientEmail}
    //                   onChange={(e) =>
    //                     setJobCard({
    //                       ...jobCard,
    //                       clientAddress: e.target.value,
    //                     })
    //                   }
    //                 />
    //               </div>
    //             </div>
    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="client-location">
    //                 Cellphone :
    //               </label>
    //               <div className="uk-form-controls">
    //                 <input
    //                   className="uk-input uk-form-small"
    //                   type="phone"
    //                   id="client-location"
    //                   placeholder="Telephone"
    //                   value={jobCard.clientMobileNumber}
    //                   onChange={(e) =>
    //                     setJobCard({
    //                       ...jobCard,
    //                       clientMobileNumber: e.target.value,
    //                     })
    //                   }
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //           <div>
    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="client-location">
    //                 Email:
    //               </label>
    //               <div className="uk-form-controls">
    //                 <input
    //                   className="uk-input uk-form-small"
    //                   type="text"
    //                   id="client-location"
    //                   placeholder="Address"
    //                   value={jobCard.clientEmail}
    //                   onChange={(e) =>
    //                     setJobCard({
    //                       ...jobCard,
    //                       clientEmail: e.target.value,
    //                     })
    //                   }
    //                 />
    //               </div>
    //             </div>
    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="client-location">
    //                 Erf:
    //               </label>
    //               <div className="uk-form-controls">
    //                 <input
    //                   className="uk-input uk-form-small"
    //                   type="text"
    //                   id="client-location"
    //                   placeholder="Address"
    //                   value={jobCard.erf}
    //                   onChange={(e) =>
    //                     setJobCard({
    //                       ...jobCard,
    //                       erf: e.target.value,
    //                     })
    //                   }
    //                 />
    //               </div>
    //             </div>

    //             <div className="uk-margin">
    //               <label className="uk-form-label" htmlFor="client-location">
    //                 Telephone Number:
    //               </label>
    //               <div className="uk-form-controls">
    //                 <input
    //                   className="uk-input uk-form-small"
    //                   type="phone"
    //                   id="client-location"
    //                   placeholder="Telephone"
    //                   value={jobCard.clientTelephone}
    //                   onChange={(e) =>
    //                     setJobCard({
    //                       ...jobCard,
    //                       clientTelephone: e.target.value,
    //                     })
    //                   }
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="uk-margin">
    //           <label className="uk-form-label" htmlFor="client-location">
    //             Type of Work
    //           </label>
    //           <div className="uk-form-controls">
    //             <input
    //               className="uk-input uk-form-small"
    //               type="text"
    //               id="client-location"
    //               placeholder="Type of Work"
    //               value={jobCard.typeOfWork}
    //               onChange={(e) =>
    //                 setJobCard({
    //                   ...jobCard,
    //                   typeOfWork: e.target.value,
    //                 })
    //               }
    //             />
    //           </div>
    //         </div>
    //         <h3>Job Card Management and allocation {jobCard.uniqueId}</h3>

    //         <div className="uk-grid">
    //           <div className="uk-width-1-4">
    //             <div className="uk-margin">
    //               <input
    //                 placeholder="Start Date"
    //                 id="issuedDate"
    //                 type="date"
    //                 value={jobCard.dateIssued}
    //                 onChange={(e) =>
    //                   setJobCard({ ...jobCard, dateIssued: e.target.value })
    //                 }
    //               />
    //             </div>
    //           </div>
    //           <div className="uk-width-1-4">
    //             <div className="uk-margin">
    //               <input
    //                 placeholder="Issued Time"
    //                 id="issuedTime"
    //                 type="time"
    //                 value={jobCard.dueDate}
    //                 onChange={(e) =>
    //                   setJobCard({ ...jobCard, dueDate: e.target.value })
    //                 }
    //               />
    //             </div>
    //           </div>
    //         </div>

    //         <>
    //           <div className="uk-grid">
    //             <div className="uk-width-1-2">
    //               <div className="uk-margin-right">
    //                 <label htmlFor="issuedTime">Team Leader</label>
    //                 <div className="uk-form-controls">
    //                   <SingleSelect
    //                     name="search-team"
    //                     options={options}
    //                     width="250px"
    //                     onChange={handleTeamLeaderChange}
    //                     placeholder="Search by name"
    //                     value={teamLeaderValue}
    //                   />
    //                 </div>
    //               </div>
    //               <div className="uk-margin-right">
    //                 <label htmlFor="issuedDate">Artesian</label>
    //                 <div className="uk-form-controls">
    //                   <SingleSelect
    //                     name="search-team"
    //                     options={options}
    //                     width="250px"
    //                     onChange={handleArtesianChange}
    //                     placeholder="Search by name"
    //                     value={artesianValue}
    //                   />
    //                 </div>
    //               </div>

    //               <div>
    //                 <label htmlFor="issuedTime">Team Member</label>
    //                 <div className="uk-form-controls">
    //                   <SingleSelect
    //                     name="search-team"
    //                     options={options}
    //                     width="250px"
    //                     onChange={handleTeamMemberChange}
    //                     placeholder="Search by name"
    //                     value={teamMemberValue}
    //                   />
    //                 </div>
    //               </div>
    //               <div>
    //                 <label htmlFor="issuedTime">KPI?Measure</label>
    //                 <SingleSelect
    //                   name="search-measure"
    //                   options={measuresOptions}
    //                   width="250px"
    //                   onChange={handleMeasureChange}
    //                   placeholder="Select measure"
    //                   value={jobCard.measure}
    //                 />
    //               </div>
    //             </div>

    //             <div className="uk-width-1-2">
    //               <div className="uk-margin">
    //                 <h3>Team Details</h3>

    //                 <div>
    //                   {/* Displaying user details */}
    //                   <p>
    //                     Team Leader:{" "}
    //                     {
    //                       users.find(
    //                         (user) => user.asJson.uid === jobCard.teamLeader
    //                       )?.asJson.displayName
    //                     }
    //                   </p>
    //                   <p>
    //                     Artesian:{" "}
    //                     {
    //                       users.find(
    //                         (user) => user.asJson.uid === jobCard.artesian
    //                       )?.asJson.displayName
    //                     }
    //                   </p>
    //                   <p>
    //                     Team Member:{" "}
    //                     {
    //                       users.find(
    //                         (user) => user.asJson.uid === jobCard.teamMember
    //                       )?.asJson.displayName
    //                     }
    //                   </p>

    //                   {/* Add more details here as needed */}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </>

    //         <div className="uk-grid">
    //           <div className="uk-width-1-1">
    //             <button
    //               className="btn btn-primary"
    //               onClick={(e) => {
    //                 e.preventDefault();
    //                 onView();
    //               }}>
    //               <span>Add Material&nbsp;&nbsp;</span>
    //               <FontAwesomeIcon
    //                 icon={faPlus}
    //                 className="icon uk-margin-small-right"
    //               />
    //             </button>

    //             <h3>Material List</h3>
    //             <MaterialsGrid data={materialList} jobCard={jobCard} />
    //           </div>
    //         </div>
    //         <div className="uk-margin">
    //           <label htmlFor="remarks">Remarks:</label>
    //           <textarea
    //             id="remarks"
    //             className="uk-textarea"
    //             placeholder="Enter remarks..."
    //             value={jobCard.remark}
    //             onChange={(e) =>
    //               setJobCard({ ...jobCard, remark: e.target.value })
    //             }
    //           />
    //         </div>

    //         <div
    //           className="uk-width-1-1 uk-text-right"
    //           style={{ marginTop: "10px" }}>
    //           {/* <button onClick={handleNextClick}>Next</button> */}
    //           <button
    //             type="submit"
    //             className="btn btn-primary"
    //             disabled={loading}
    //             // onClick={handleCreateJobCard}
    //           >
    //             Save {loading && <div data-uk-spinner="ratio: .5"></div>}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>

    //   <Modal modalId={MODAL_NAMES.EXECUTION.ADDJOBCARDMATERIAL_MODAL}>
    //     <AddNewMaterialModal />
    //   </Modal>
    //   <Modal modalId={MODAL_NAMES.EXECUTION.ONEDITMATERIAL_MODAL}>
    //     <OnEditMaterial />
    //   </Modal>
    // </ErrorBoundary>

    <ErrorBoundary>
      <div
        className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2"
        style={{ width: "60%" }}>
        <button
          className="uk-modal-close-default"
          // onClick={onCancel}
          disabled={loading}
          type="button"
          data-uk-close></button>
        <h3 className="main-title-small text-to-break"> Edit Job Card</h3>
        <hr />

        <div className="uk-grid">
          <div className="uk-width-1-3">
            {jobCard && (
              <div className="uk-width-1-1 uk-margin-medium-top">
                <h4>Selected Job Card Details</h4>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                  <div className="uk-width-1-3">
                    <p>Client Name:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Account</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Entity No.</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Product Code</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Account Balance:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Remaining Balance:</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
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
                    <p>Bank Name</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Account Name</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Account No.</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{jobCard.clientEmail}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Branch No.</p>
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
            <h4>Allocated Job Card</h4>

            <hr />
            <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
              <div className="uk-grid uk-child-width-1-2" data-uk-grid>
                <div>
                  {/* Form fields for the first column */}
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    {/* Add margin-bottom to create spacing */}
                    <label className="uk-form-label required" htmlFor="">
                      Division
                    </label>
                    <input
                      type="text"
                      className="uk-input"
                      placeholder="Division"
                      value={jobCard.division}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          division: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Add margin-bottom to create spacing */}

                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label className="uk-form-label required" htmlFor="">
                      Urgency
                    </label>
                    <select
                      className="uk-select uk-form-small"
                      id="urgency"
                      value={jobCard.urgency}
                      onChange={handleUrgencyChange}
                      required>
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Very Urgent">Very Urgent</option>
                    </select>
                  </div>

                  {/* Add margin-bottom to create spacing */}

                  {/* Add margin-bottom to create spacing */}
                </div>
                <div>
                  {/* Form fields for the second column */}
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label
                      className="uk-form-label required"
                      htmlFor="valueDate">
                      Assign
                    </label>
                    <select
                      className="uk-select uk-form-small"
                      id="assignTo"
                      value={selectedUser}
                      onChange={handleUserChange}
                      required>
                      <option value="">Assign to</option>
                      {users.map((user) => (
                        <option key={user.asJson.uid} value={user.asJson.uid}>
                          {user.asJson.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add margin-bottom to create spacing */}

                  {/* Add margin-bottom to create spacing */}
                  <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-1 uk-width-1-1 uk-margin-bottom">
                    {/* Add margin-bottom to create spacing */}
                  </div>
                </div>
                <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                  {/* Add margin-bottom to create spacing */}
                  <label className="uk-form-label required" htmlFor="">
                    Task Description(max char. 30)
                  </label>
                  <textarea
                    className="uk-textarea uk-form-small"
                    defaultValue="Task Description"
                    rows={3}
                    id="amount"
                    maxLength={30}
                    name={"amount"}
                    // onChange={(e) =>
                    //   setClientWithdrawal({
                    //     ...clientWithdrawal,
                    //     reference: e.target.value,
                    //   })
                    // }
                    required
                  />
                </div>
              </div>
              <div className="uk-grid uk-child-width-1-2" data-uk-grid>
                <div>
                  {/* Form fields for the first column */}
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label className="uk-form-label required" htmlFor="amount">
                      Full Name
                    </label>
                    <input
                      type="tel"
                      className="uk-input uk-form-small"
                      id="client-mobile"
                      placeholder="Cellphone"
                      value={jobCard.clientMobileNumber}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          clientMobileNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label className="uk-form-label required" htmlFor="amount">
                      Cellphone Number
                    </label>
                    <input
                      type="tel"
                      className="uk-input uk-form-small"
                      id="client-mobile"
                      placeholder="Cellphone"
                      value={jobCard.clientMobileNumber}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          clientMobileNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label className="uk-form-label" htmlFor="">
                      Client Email
                    </label>
                    <input
                      type="email"
                      className="uk-input uk-form-small"
                      id="client-email"
                      placeholder="Email"
                      value={jobCard.clientEmail}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          clientEmail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Add margin-bottom to create spacing */}

                  {/* Add margin-bottom to create spacing */}

                  {/* Add margin-bottom to create spacing */}
                </div>
                <div>
                  {/* Add margin-bottom to create spacing */}
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label className="uk-form-label" htmlFor="">
                      Address
                    </label>
                    <input
                      type="email"
                      className="uk-input uk-form-small"
                      id="client-email"
                      placeholder="Email"
                      value={jobCard.clientEmail}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          clientEmail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Add margin-bottom to create spacing */}
                  <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                    <label className="uk-form-label" htmlFor="">
                      Client Email
                    </label>
                    <input
                      type="email"
                      className="uk-input uk-form-small"
                      id="client-email"
                      placeholder="Email"
                      value={jobCard.clientEmail}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          clientEmail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Add margin-bottom to create spacing */}
                  <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-1 uk-width-1-1 uk-margin-bottom">
                    {/* Add margin-bottom to create spacing */}

                    <div className="uk-form-controls uk-width-1-1 ">
                      <input
                        type="text"
                        className="uk-input uk-form-small"
                        id="type-of-work"
                        placeholder="Type of Work"
                        value={jobCard.typeOfWork}
                        onChange={(e) =>
                          setJobCard({
                            ...jobCard,
                            typeOfWork: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                  {/* Add margin-bottom to create spacing */}
                  <label className="uk-form-label required" htmlFor="">
                    Remark(max char. 30)
                  </label>
                  <textarea
                    className="uk-textarea uk-form-small"
                    defaultValue="Task Description"
                    rows={3}
                    id="amount"
                    maxLength={30}
                    name={"amount"}
                    // onChange={(e) =>
                    //   setClientWithdrawal({
                    //     ...clientWithdrawal,
                    //     reference: e.target.value,
                    //   })
                    // }
                    required
                  />
                </div>
              </div>
              <div
                className="uk-width-1-1 uk-text-right"
                style={{ marginTop: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}>
                  Create {loading && <div data-uk-spinner="ratio: .5"></div>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default EditJobCardModal;



//  <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
//    <div className="uk-grid uk-child-width-1-2" data-uk-grid>
//      <div>
//        {/* Form fields for the first column */}
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          {/* Add margin-bottom to create spacing */}
//          <label className="uk-form-label required" htmlFor="">
//            Division
//          </label>
//          <input
//            type="text"
//            className="uk-input"
//            placeholder="Division"
//            value={jobCard.division}
//            onChange={(e) =>
//              setJobCard({
//                ...jobCard,
//                division: e.target.value,
//              })
//            }
//            required
//          />
//        </div>

//        {/* Add margin-bottom to create spacing */}

//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label required" htmlFor="">
//            Urgency
//          </label>
//          <select
//            className="uk-select uk-form-small"
//            id="urgency"
//            value={jobCard.urgency}
//            onChange={handleUrgencyChange}
//            required>
//            <option value="Normal">Normal</option>
//            <option value="Urgent">Urgent</option>
//            <option value="Very Urgent">Very Urgent</option>
//          </select>
//        </div>

//        {/* Add margin-bottom to create spacing */}

//        {/* Add margin-bottom to create spacing */}
//      </div>
//      <div>
//        {/* Form fields for the second column */}
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label required" htmlFor="valueDate">
//            Assign
//          </label>
//          <select
//            className="uk-select uk-form-small"
//            id="assignTo"
//            value={selectedUser}
//            onChange={handleUserChange}
//            required>
//            <option value="">Assign to</option>
//            {users.map((user) => (
//              <option key={user.asJson.uid} value={user.asJson.uid}>
//                {user.asJson.displayName}
//              </option>
//            ))}
//          </select>
//        </div>

//        {/* Add margin-bottom to create spacing */}

//        {/* Add margin-bottom to create spacing */}
//        <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-1 uk-width-1-1 uk-margin-bottom">
//          {/* Add margin-bottom to create spacing */}
//        </div>
//      </div>
//      <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//        {/* Add margin-bottom to create spacing */}
//        <label className="uk-form-label required" htmlFor="">
//          Task Description(max char. 30)
//        </label>
//        <textarea
//          className="uk-textarea uk-form-small"
//          defaultValue="Task Description"
//          rows={3}
//          id="amount"
//          maxLength={30}
//          name={"amount"}
//          // onChange={(e) =>
//          //   setClientWithdrawal({
//          //     ...clientWithdrawal,
//          //     reference: e.target.value,
//          //   })
//          // }
//          required
//        />
//      </div>
//    </div>
//    <div className="uk-grid uk-child-width-1-2" data-uk-grid>
//      <div>
//        {/* Form fields for the first column */}
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label required" htmlFor="amount">
//            Full Name
//          </label>
//          <input
//            type="tel"
//            className="uk-input uk-form-small"
//            id="client-mobile"
//            placeholder="Cellphone"
//            value={jobCard.clientMobileNumber}
//            onChange={(e) =>
//              setJobCard({
//                ...jobCard,
//                clientMobileNumber: e.target.value,
//              })
//            }
//            required
//          />
//        </div>
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label required" htmlFor="amount">
//            Cellphone Number
//          </label>
//          <input
//            type="tel"
//            className="uk-input uk-form-small"
//            id="client-mobile"
//            placeholder="Cellphone"
//            value={jobCard.clientMobileNumber}
//            onChange={(e) =>
//              setJobCard({
//                ...jobCard,
//                clientMobileNumber: e.target.value,
//              })
//            }
//            required
//          />
//        </div>
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label" htmlFor="">
//            Client Email
//          </label>
//          <input
//            type="email"
//            className="uk-input uk-form-small"
//            id="client-email"
//            placeholder="Email"
//            value={jobCard.clientEmail}
//            onChange={(e) =>
//              setJobCard({
//                ...jobCard,
//                clientEmail: e.target.value,
//              })
//            }
//            required
//          />
//        </div>

//        {/* Add margin-bottom to create spacing */}

//        {/* Add margin-bottom to create spacing */}

//        {/* Add margin-bottom to create spacing */}
//      </div>
//      <div>
//        {/* Add margin-bottom to create spacing */}
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label" htmlFor="">
//            Address
//          </label>
//          <input
//            type="email"
//            className="uk-input uk-form-small"
//            id="client-email"
//            placeholder="Email"
//            value={jobCard.clientEmail}
//            onChange={(e) =>
//              setJobCard({
//                ...jobCard,
//                clientEmail: e.target.value,
//              })
//            }
//            required
//          />
//        </div>

//        {/* Add margin-bottom to create spacing */}
//        <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//          <label className="uk-form-label" htmlFor="">
//            Client Email
//          </label>
//          <input
//            type="email"
//            className="uk-input uk-form-small"
//            id="client-email"
//            placeholder="Email"
//            value={jobCard.clientEmail}
//            onChange={(e) =>
//              setJobCard({
//                ...jobCard,
//                clientEmail: e.target.value,
//              })
//            }
//            required
//          />
//        </div>

//        {/* Add margin-bottom to create spacing */}
//        <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-1 uk-width-1-1 uk-margin-bottom">
//          {/* Add margin-bottom to create spacing */}

//          <div className="uk-form-controls uk-width-1-1 ">
//            <input
//              type="text"
//              className="uk-input uk-form-small"
//              id="type-of-work"
//              placeholder="Type of Work"
//              value={jobCard.typeOfWork}
//              onChange={(e) =>
//                setJobCard({
//                  ...jobCard,
//                  typeOfWork: e.target.value,
//                })
//              }
//              required
//            />
//          </div>
//        </div>
//      </div>
//      <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
//        {/* Add margin-bottom to create spacing */}
//        <label className="uk-form-label required" htmlFor="">
//          Remark(max char. 30)
//        </label>
//        <textarea
//          className="uk-textarea uk-form-small"
//          defaultValue="Task Description"
//          rows={3}
//          id="amount"
//          maxLength={30}
//          name={"amount"}
//          // onChange={(e) =>
//          //   setClientWithdrawal({
//          //     ...clientWithdrawal,
//          //     reference: e.target.value,
//          //   })
//          // }
//          required
//        />
//      </div>
//    </div>
//    <div className="uk-width-1-1 uk-text-right" style={{ marginTop: "10px" }}>
//      <button type="submit" className="btn btn-primary" disabled={loading}>
//        Create {loading && <div data-uk-spinner="ratio: .5"></div>}
//      </button>
//    </div>
//  </form>;