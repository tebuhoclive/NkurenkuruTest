// Step2.tsx
// UpdateJobCard.tsx
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { useNavigate} from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useAppContext } from "../../shared/functions/Context";

import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
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

interface Step2Props {
  handleNext: () => void;
}

// Wrap the component with observer
const Step2: React.FC<Step2Props> = observer(({ handleNext }) => {
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const [artesianValue, setArtesianValue] = useState(""); // State for Artesian input
  const [teamLeaderValue, setTeamLeaderValue] = useState(""); // State for Team Leader input
  const [teamMemberValue, setTeamMemberValue] = useState(""); // State for Team Member input

  // Additional state or logic specific to Step 2

  const handleNextClick = () => {
    // Additional validation or processing can be done here
    handleNext();
  };
  //const { jobId } = useParams();
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
    setJobCard({ ...jobCard, teamMembers: value });
    // Additional logic if needed
  };


 
  const uid = "1wszJRRvmDRcr3fw8L9VQl64qfh1";
  const measure = store.measure.getByUid(uid);
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

  // const taskList = store.jobcard.task.all;
  const materialList = store.jobcard.material.all;



  const onView = () => {
    store.jobcard.jobcard.select(jobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ADDJOBCARDMATERIAL_MODAL);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // navigate(`/c/job-cards/review/${jobId}`);
      await api.jobcard.jobcard.update(jobCard);
      console.log("jobcard", jobCard);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error submitting form:", error);
    } finally {
      //  handleNext();
      setLoading(false);
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

      await api.measure.getAll();
      await api.department.getAll();
    };
    loadData();
  }, [api.user, api.jobcard, api.department]);

  return (
    <ErrorBoundary>
      <div className="uk-flex" style={{ justifyContent: "center" }}>
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small "
          style={{ width: "70%", justifyContent: "center" }}
          onSubmit={handleSubmit}>
          {/* Add Task Section */}
          <h3>Job Card Management and allocation {jobCard.uniqueId}</h3>

          <div className="uk-grid">
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
          </div>

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

          <div className="uk-grid">
            <div className="uk-width-1-1">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onView();
                }}>
                <span>Add Material&nbsp;&nbsp;</span>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="icon uk-margin-small-right"
                />
              </button>

              <h3>Material List</h3>
              <MaterialsGrid data={materialList} jobCard={jobCard} />
            </div>
          </div>
          <div className="uk-margin">
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              className="uk-textarea"
              placeholder="Enter remarks..."
              value={jobCard.remark}
              onChange={(e) =>
                setJobCard({ ...jobCard, remark: e.target.value })
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
                submit and Complete{" "}
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Modal modalId={MODAL_NAMES.EXECUTION.ADDJOBCARDMATERIAL_MODAL}>
        <AddNewMaterialModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default Step2;
