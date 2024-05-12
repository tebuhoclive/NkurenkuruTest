// CreateJobCard.jsx

import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import "datatables.net";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-responsive-bs4";
import "datatables.net-searchbuilder-bs4";
import "datatables.net-searchpanes-bs4";
import "datatables.net-staterestore-bs4";
import { useNavigate } from "react-router-dom";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import { hideModalFromId } from "../../shared/functions/ModalShow";
import MODAL_NAMES from "../dialogs/ModalName";






const CreateJobCard = observer(() => {
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const [selectedUser, setSelectedUser] = useState(jobCard.assignedTo);

  const users = store.user.all;

  const generateUniqueId = () => {
    const existingUid = store.jobcard.jobcard.all;

    // Extract the unique IDs from the existing job cards
    const existingUniqueIds = existingUid.map(
      (employee) => employee.asJson.uniqueId
    );

    let idCounter = 1;
    // Generate a unique ID and check for uniqueness
    let nextUniqueId = `N${idCounter.toString().padStart(3, "0")}`;
    while (existingUniqueIds.includes(nextUniqueId)) {
      idCounter++;
      nextUniqueId = `N${idCounter.toString().padStart(3, "0")}`;
    }

    return nextUniqueId;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const uniqueId = generateUniqueId();
      const updatedJobCard = {
        ...jobCard,
        uniqueId: uniqueId,
        dateIssued: dateTimeLogged,
      };
      setJobCard(updatedJobCard);
      await api.jobcard.jobcard.create(updatedJobCard);

      console.log("my created job card ", updatedJobCard);

      // store.jobcard.jobcard.select(jobCard);
      store.jobcard.jobcard.select(updatedJobCard);
    } catch (error) {
    } finally {
      onCancel()
      setLoading(false);
    }
  };
    const onCancel = () => {
      store.jobcard.jobcard.clearSelected();
      setJobCard({ ...defaultJobCard });
      hideModalFromId(MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL);
    };

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUser(selectedUserId);
     setJobCard({
       ...jobCard,
       assignedTo: selectedUserId,
     });
    // Perform additional actions if needed, such as updating jobCard state
  };
  const uniqueId = generateUniqueId();
  useEffect(() => {
    if (store.jobcard.jobcard.selected) {
      setJobCard(store.jobcard.jobcard.selected);
    }
  }, [store.jobcard.jobcard.selected]);

  useEffect(() => {
    const loadData = async () => {
      await api.user.getAll();
      await api.jobcard.jobcard.getAll();
      await api.user.getAll();

      await api.department.getAll();
    };
    loadData();
  }, [api.user, api.jobcard, api.department]);

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobCard({
      ...jobCard,
      urgency: e.target.value as IUrgency,
    });
  };

  // Get the current date and time
  const dateTimeLogged = new Date().toLocaleString();

  return (
    <>
      <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
        <button
          className="uk-modal-close-default"
          // onClick={onCancel}
          disabled={loading}
          type="button"
          data-uk-close></button>
        <h3 className="main-title-small text-to-break uk-text-bold">
          Record NewJob Card
        </h3>

        <hr />

        <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
          <div className="uk-grid uk-child-width-1-2" data-uk-grid>
            <div>
              {/* Form fields for the first column */}
              <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                <label className="uk-form-label required" htmlFor="division">
                  Division
                </label>
                <select
                  className="uk-select"
                  id="division"
                  value={jobCard.division}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      division: e.target.value,
                    })
                  }
                  required>
                  <option value="">Select Division</option>
                  <option value="Division 1">Technical</option>
                  <option value="Division 2">Division 2</option>
                  <option value="Division 3">Division 3</option>
                  {/* Add more options for each division */}
                </select>
              </div>
              <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                <label className="uk-form-label required" htmlFor="division">
                  Section
                </label>
                <select
                  className="uk-select"
                  id="division"
                  value={jobCard.section}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      section: e.target.value,
                    })
                  }
                  required>
                  <option value="">Select Division</option>
                  <option value="Section 1">Roads Section</option>
                  <option value="Section 1">Sewage Section</option>
                  <option value="Section 1">Electricity Section</option>
                  <option value="Section 1">Water Section</option>
                  {/* Add more options for each division */}
                </select>
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
                <label className="uk-form-label required" htmlFor="valueDate">
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
                placeholder="Task Description"
                rows={3}
                id="task description"
                value={jobCard.taskDescription}
                maxLength={30}
                name={"amount"}
                onChange={(e) =>
                  setJobCard({
                    ...jobCard,
                    taskDescription: e.target.value,
                  })
                }
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
                  placeholder="Full Name"
                  value={jobCard.clientFullName}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      clientFullName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                <label
                  className="uk-form-label required"
                  htmlFor="client-mobile">
                  Cellphone Number
                </label>
                <input
                  type="tel"
                  className="uk-input uk-form-small"
                  id="client-mobile"
                  placeholder="Cellphone"
                  value={jobCard.clientMobileNumber}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Allow only numbers and limit the length to 10 digits
                    const sanitizedInput = input
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    // Apply cellphone number format (e.g., XXX-XXX-XXXX)
                    const formattedInput = sanitizedInput.replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      "$1-$2-$3"
                    );
                    // Update jobCard state with formatted input
                    setJobCard({
                      ...jobCard,
                      clientMobileNumber: formattedInput,
                    });
                  }}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" // Pattern for cellphone number format
                  title="Please enter a valid cellphone number (e.g., XXX-XXX-XXXX)"
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
            </div>
            <div>
              {/* Add margin-bottom to create spacing */}
              <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                <label className="uk-form-label" htmlFor="client-address">
                  Address
                </label>
                <input
                  type="text" // Change type to "text" for address input
                  className="uk-input uk-form-small"
                  id="client-address"
                  placeholder="Address"
                  value={jobCard.clientAddress}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      clientAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Add margin-bottom to create spacing */}
              <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
                <label className="uk-form-label" htmlFor="">
                  Type of work
                </label>
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

              {/* Add margin-bottom to create spacing */}
              {/* <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-1 uk-width-1-1 uk-margin-bottom">
               

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
              </div> */}
            </div>
            <div className="uk-form-controls uk-width-1-1 uk-margin-bottom">
              {/* Add margin-bottom to create spacing */}
              <label className="uk-form-label required" htmlFor="">
                Remarks(max char. 30)
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                placeholder="Remarks"
                rows={3}
                id="amount"
                maxLength={30}
                name={"remark"}
                onChange={(e) =>
                  setJobCard({
                    ...jobCard,
                    remark: e.target.value,
                  })
                }
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
    </>
  );
});

export default CreateJobCard;
