// Step1.tsx

// CreateJobCard.jsx

import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";

import "../company-job-card/styles/ReviewStep.scss";
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
import {
  IClient,
  defaultClient,
} from "../../shared/models/job-card-model/Client";
import IsRequiredInput from "./Required";

interface Step1Props {
  handleNext: () => void;
}

// Wrap the component with observer
const Step1: React.FC<Step1Props> = observer(({ handleNext }) => {
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
 const [selectUserId,setSelectedUserId]=useState("")
  const navigate = useNavigate();
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
        dateIssued: dateTimeLogged
      };
      setJobCard(updatedJobCard);
      await api.jobcard.jobcard.create(updatedJobCard);

      console.log("my created job card ", updatedJobCard);

      // store.jobcard.jobcard.select(jobCard);
      store.jobcard.jobcard.select(updatedJobCard);
    } catch (error) {
    } finally {
      handleNext();
      setLoading(false);
    }
  };

   const handleUserChange = (event) => {
     const selectedUserId = event.target.value;
     setSelectedUser(selectedUserId);
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
  const handleNextClick = () => {
    // Additional validation or processing can be done here
    handleNext();
  };

  return (
    <>
      <div className="uk-flex" style={{ justifyContent: "center" }}>
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small "
          style={{ width: "70%", justifyContent: "center" }}
          onSubmit={handleSubmit}>
          {/*Heading*/}
          <div style={{ textAlign: "center" }}>
            <h2>JOB CARD FOR MUNICIPAL SERVICES</h2>
            <p style={{ fontStyle: "italic" }}>
              (E.g Roads, water, sewerage reticulations/connections, and other
              repairs)
            </p>
            <div className="uk-flex uk-flex-between uk-flex-middle">
              <p className="text-to-break">Job Card Identifier: {uniqueId}</p>
              <p>Date and Time logged: {dateTimeLogged}</p>
            </div>
          </div>
          <div className="uk-grid uk-child-width-1-2@s" data-uk-grid>
            <div>
              <div className="uk-margin">
                <IsRequiredInput
                  type="text"
                  id="objectives"
                  placeholder="Division"
                  value={jobCard.division}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      division: e.target.value,
                    })
                  }
                />
              </div>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="assignTo">
                  Assign To
                </label>
                <div className="uk-form-controls">
                  <select
                    className="uk-select uk-form-small"
                    id="assignTo"
                    value={selectedUser}
                    onChange={handleUserChange}
                    required>
                    <option value="">Assign to</option>{" "}
                    {/* Placeholder option */}
                    {users.map((user) => (
                      <option key={user.asJson.uid} value={user.asJson.uid}>
                        {user.asJson.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className="uk-margin">
                <IsRequiredInput
                  type="text"
                  id="objectives"
                  placeholder="Section"
                  value={jobCard.section}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      section: e.target.value,
                    })
                  }
                />
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="urgency">
                  Urgency:
                </label>
                <div className="uk-form-controls">
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
              </div>
            </div>
          </div>
          <div>
            {" "}
            <p>Client Details.</p>
          </div>
          <div className="uk-grid uk-child-width-1-2@s" data-uk-grid>
            <div>
              {/* Content for the first column */}

              <div className="uk-margin">
                <IsRequiredInput
                  type="text"
                  id="objectives"
                  placeholder="Full Names"
                  value={jobCard.clientFullName}
                  onChange={(e) =>
                    setJobCard({
                      ...jobCard,
                      clientFullName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="client-location">
                  Email:
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input uk-form-small"
                    type="text"
                    id="client-location"
                    placeholder="Address"
                    value={jobCard.clientEmail}
                    onChange={(e) =>
                      setJobCard({
                        ...jobCard,
                        clientAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="client-location">
                  Cellphone :
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input uk-form-small"
                    type="phone"
                    id="client-location"
                    placeholder="Telephone"
                    value={jobCard.clientMobileNumber}
                    onChange={(e) =>
                      setJobCard({
                        ...jobCard,
                        clientMobileNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="client-location">
                  Email:
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input uk-form-small"
                    type="text"
                    id="client-location"
                    placeholder="Address"
                    value={jobCard.clientEmail}
                    onChange={(e) =>
                      setJobCard({
                        ...jobCard,
                        clientEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="client-location">
                  Erf:
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input uk-form-small"
                    type="text"
                    id="client-location"
                    placeholder="Address"
                    value={jobCard.erf}
                    onChange={(e) =>
                      setJobCard({
                        ...jobCard,
                        erf: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="client-location">
                  Telephone Number:
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input uk-form-small"
                    type="phone"
                    id="client-location"
                    placeholder="Telephone"
                    value={jobCard.clientTelephone}
                    onChange={(e) =>
                      setJobCard({
                        ...jobCard,
                        clientTelephone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="client-location">
              Type of Work
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-small"
                type="text"
                id="client-location"
                placeholder="Type of Work"
                value={jobCard.typeOfWork}
                onChange={(e) =>
                  setJobCard({
                    ...jobCard,
                    typeOfWork: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div
            className="uk-width-1-1 uk-text-right"
            style={{ marginTop: "10px" }}>
            {/* <button onClick={handleNextClick}>Next</button> */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              // onClick={handleCreateJobCard}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
});

export default Step1;
