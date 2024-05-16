// CreateJobCard.jsx

import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import "datatables.net";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-responsive-bs4";
import "datatables.net-searchbuilder-bs4";
import "datatables.net-searchpanes-bs4";
import "datatables.net-staterestore-bs4";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import SingleSelect, {
  IOption,
} from "../../../shared/components/single-select/SingleSelect";
import { dateFormat_YY_MM_DY } from "../../shared/utils/utils";

const CreateJobCardModal = observer(() => {
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

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

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

      // store.jobcard.jobcard.select(jobCard);
      store.jobcard.jobcard.select(updatedJobCard);
    } catch (error) {
    } finally {
      onCancel();
      setLoading(false);
    }
  };
  const onCancel = () => {
    store.jobcard.jobcard.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL);
  };

  //Naftal comments
  const businessUnit = store.businessUnit.all;

  const businessUnitOptions: IOption[] = useMemo(
    () =>
      businessUnit.map((bu) => {
        return {
          label: bu.asJson.name || "",
          value: bu.asJson.id,
        };
      }),
    [businessUnit]
  );

  const handleBusinessUnitOptions = (value: string) => {
    setJobCard({ ...jobCard, division: value });
    // Additional logic if needed
  };

  const departments = store.department.all;

  // Filter departments based on jobCard.division value
  const filteredDepartments = departments.filter(
    (department) => department.asJson.businessUnit === jobCard.division
  );

  const departmentOptions: IOption[] = useMemo(
    () =>
      filteredDepartments.map((dept) => {
        return {
          label: dept.asJson.name || "",
          value: dept.asJson.id,
        };
      }),
    [filteredDepartments]
  );
  const handleDepartmentOptions = (value: string) => {
    setJobCard({ ...jobCard, section: value });
    // Additional logic if needed
  };

  const uniqueId = generateUniqueId();
  useEffect(() => {
    // if (store.jobcard.jobcard.selected) {
    //   setJobCard(store.jobcard.jobcard.selected);
    // }
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

  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.department.getAll();
        await api.businessUnit.getAll();
      } catch (error) {
        // console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.businessUnit, api.department, api.scorecard, api.user]);

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobCard({
      ...jobCard,
      urgency: e.target.value as IUrgency,
    });
  };
  // Define a function to handle changes to the due date
  const handleDateChange = (newDate: number) => {
    console.log("new date", newDate);

    setJobCard({
      ...jobCard,
      dueDate: newDate,
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
        <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Job Card Form
        </span>
        {/* <h3 className="main-title-small text-to-break uk-text-bold">
          Record New Job Card
        </h3> */}

        <hr />

        <form
          className="uk-form uk-grid uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}>
          <div className="uk-grid uk-width-1-1">
            <h4>Job Card Details</h4>
          </div>
          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label" htmlFor="division">
              Division<span className="uk-text-danger">*</span>
            </label>
            {/* Place the SingleSelect component here */}
            <SingleSelect
              name="search-team"
              options={businessUnitOptions}
              // width="250px"
              onChange={handleBusinessUnitOptions}
              placeholder="Select Division"
              value={jobCard.division}
            />
          </div>
          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label required" htmlFor="division">
              Section<span className="uk-text-danger">*</span>
            </label>
            <SingleSelect
              name="search-team"
              options={departmentOptions}
              // width="250px"
              onChange={handleDepartmentOptions}
              placeholder="Select section"
              value={jobCard.division}
              // required
            />
          </div>
          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label required" htmlFor="">
              Urgency<span className="uk-text-danger">*</span>
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

          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label required" htmlFor="dueDate">
              Due Date<span className="uk-text-danger">*</span>
            </label>
            <input
              className="uk-input uk-form-small"
              id="dueDate"
              type="date"
              name="dueDate"
              value={dateFormat_YY_MM_DY(jobCard.dueDate) || ""}
              onChange={(e) => handleDateChange(e.target.valueAsNumber)}
              min={today} // Set the minimum date to today's date
              // required
            />
          </div>
          <div
            className="uk-form-controls uk-width-1-1 "
            style={{ paddingRight: "5px" }}>
            {/* Add margin-bottom to create spacing */}
            <label className="uk-form-label required" htmlFor="">
              Task Description <span className="uk-text-danger">*</span>
            </label>
            <textarea
              className="uk-textarea uk-form-small"
              placeholder="Task Description"
              rows={3}
              id="task description"
              value={jobCard.taskDescription}
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
          <div className="uk-width-1-1">
            {" "}
            <h4 className="uk-text-bold">Client Details</h4>
          </div>

          {/* Form fields for the first column */}
          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label required" htmlFor="amount">
              Full Name<span className="uk-text-danger">*</span>
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
          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label required" htmlFor="client-mobile">
              Cellphone Number <span className="uk-text-danger">*</span>
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
                const sanitizedInput = input.replace(/\D/g, "").slice(0, 10);
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
          <div className="uk-form-controls uk-width-1-2 ">
            <label className="uk-form-label required" htmlFor="client-mobile">
              Cellphone Number (Secondary){" "}
            </label>
            <input
              type="tel"
              className="uk-input uk-form-small"
              id="client-mobile"
              placeholder="Cellphone"
              value={jobCard.clientTelephone}
              onChange={(e) => {
                const input = e.target.value;
                // Allow only numbers and limit the length to 10 digits
                const sanitizedInput = input.replace(/\D/g, "").slice(0, 10);
                // Apply cellphone number format (e.g., XXX-XXX-XXXX)
                const formattedInput = sanitizedInput.replace(
                  /(\d{3})(\d{3})(\d{4})/,
                  "$1-$2-$3"
                );
                // Update jobCard state with formatted input
                setJobCard({
                  ...jobCard,
                  clientTelephone: formattedInput,
                });
              }}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" // Pattern for cellphone number format
              title="Please enter a valid cellphone number (e.g., XXX-XXX-XXXX)"
            />
          </div>

          {/* Add margin-bottom to create spacing */}
          <div className="uk-form-controls uk-width-1-2">
            <label className="uk-form-label" htmlFor="client-address">
              Physical Address <span className="uk-text-danger">*</span>
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
            />
          </div>
          <div className="uk-form-controls uk-width-1-2 ">
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
            />
          </div>

          {/* Add margin-bottom to create spacing */}
          <div className="uk-form-controls uk-width-1-2">
            <label className="uk-form-label" htmlFor="">
              Type of work<span className="uk-text-danger">*</span>
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
          <div className="uk-form-controls uk-width-1-1 ">
            {/* Add margin-bottom to create spacing */}
            <label className="uk-form-label required" htmlFor="">
              Remarks
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
            />
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

export default CreateJobCardModal;
