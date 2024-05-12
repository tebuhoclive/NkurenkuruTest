import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import {
  IJobCard,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import "./Dashboard.css"; // Your custom styles

import {
  IClient,
  defaultClient,
} from "../../../shared/models/job-card-model/Client";
import swal from "sweetalert";
import useTitle from "../../../shared/hooks/useTitle";
import useBackButton from "../../../shared/hooks/useBack";
import JobCardTabs from "./JobCardTabs";
import CreateJobCard from "../CreateJobCard";
import AllocateJobCard from "../AllocateJobCardModal";
import JobDashboardMain from "./JobCardDashboardGrids";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import Dropdown from "../../../shared/components/dropdown/Dropdown";

import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import Modal from "../../../shared/components/Modal";

const CompanyJobCard = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<string>("JobCards");
  const [client, setClient] = useState<IClient>({ ...defaultClient });
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const onViewJobCard = (jobCard: IJobCard) => {
    store.jobcard.jobcard.select(jobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  };
  const onCreateJobCard = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL);
  };

  // const onEditJobCard = (jobCard: IJobCard) => {
  //   const currentclient = store.jobcard.client.selected;

  //   store.jobcard.jobcard.select(jobCard);

  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };

  // const onDelete = (jobCard: IJobCard) => {
  //   deleteJobCard(jobCard); // Call the Delete function
  // };

  // const deleteJobCard = async (jobCard: IJobCard) => {
  //   try {
  //     await api.jobcard.jobcard.delete(jobCard.id);
  //   } catch (error) {
  //     console.log("Error" + error);

  //     // Handle error appropriately
  //   }
  // };

  // Define a function to handle search text input
  const Jobcards = store.jobcard.jobcard.all.map((job) => {
    return job.asJson;
  });
  //stats
  const totalJobcards = store.jobcard.jobcard.all.length;

  const pendingJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Not Started";
  });
  const totalPendingJobcards = pendingJobcards.length;

  const completedJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Completed";
  });
  const totalCompletedJobcards = completedJobcards.length;



  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Job Cards");
  useBackButton();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.jobcard.jobcard.getAll();

        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.jobcard]);

  if (loading) return <LoadingEllipsis />;

  function handleExportPDF(): void {
    throw new Error("Function not implemented.");
  }

  function handleExportExcel(): void {
    throw new Error("Function not implemented.");
  }

  function handleFeedback(): void {
    throw new Error("Function not implemented.");
  }

  return (
    // <ErrorBoundary>
    //   <div className="uk-container uk-container-xlarge">
    //     {/* <h1>Job Card Dashboard</h1> */}

    //     {/* Job Cards Statistics */}

    //     <div className="uk-child-width-expand" data-uk-grid>
    //       <div className="uk-child-width-expand">
    //         <DashboardCard
    //           cardValue={totalJobcards}
    //           cardTitle="Total Job Cards"
    //           cardLink="/members"
    //           cardColour={{ background: "#5CC858" }}
    //         />
    //       </div>
    //       <div className="">
    //         <DashboardCard
    //           cardValue={totalPendingJobcards}
    //           cardTitle="Pending Job Cards"
    //           cardLink="/members/terminated"
    //           cardColour={{ background: "#FF326E" }}
    //         />
    //       </div>
    //       <div className="">
    //         <DashboardCard
    //           cardValue={totalCompletedJobcards}
    //           cardTitle=" Completed Job Cards"
    //           cardLink="/members"
    //           cardColour={{ background: "#F97A53" }}
    //         />
    //       </div>
    //     </div>
    //     <div className="uk-width-1-1">
    //       <div className="display-label">
    //         <h4 className="main-title-alt">Recent Job Card List Submissions</h4>
    //         <div>
    //           <DeductionSubmissionCard
    //             jobcards={Jobcards}
    //             onAcknowledge={handleAcknowledge}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //     <div>
    //       <ul className="uk-tab" data-uk-tab="true">
    //         <li className={activeTab === 0 ? "uk-active" : ""}>
    //           <a href="#" onClick={() => handleTabChange(0)}>
    //             Job Cards waiting Allocation
    //           </a>
    //         </li>
    //         <li className={activeTab === 1 ? "uk-active" : ""}>
    //           <a href="#" onClick={() => handleTabChange(1)}>
    //             Not Acknowledged Job Cards
    //           </a>
    //         </li>
    //         {/* Add more tabs as needed */}
    //       </ul>

    //       <ul className="uk-switcher uk-margin" data-uk-switcher="true">
    //         <li className={activeTab === 0 ? "uk-active" : ""}>
    //           <DashboardGrid data={Jobcards} />
    //         </li>
    //         <li className={activeTab === 1 ? "uk-active" : ""}>
    //           <p>Second Tab</p>
    //           <DashboardGrid data={Jobcards} />
    //         </li>
    //         {/* Add more table content as needed */}
    //       </ul>
    //     </div>
    //   </div>

    //   {/* <table className="uk-table uk-table-divider custom-table">

    //     <thead>
    //       <tr>
    //         <th className="uk-text-bold">Unique ID</th>
    //         <th className="uk-text-bold">Description</th>
    //         <th className="uk-text-bold">Status</th>
    //         <th className="uk-text-bold">Date Issued</th>
    //         <th className="uk-text-bold">Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {jobcards.map((jobCard) => (
    //         <tr key={jobCard.asJson.id}>
    //           <td>{jobCard.asJson.jobDescription}</td>
    //           <td>{jobCard.asJson.objectives}</td>
    //           <td>{jobCard.asJson.status}</td>
    //           <td>{jobCard.asJson.dateIssued}</td>
    //           <td>
    //             <button onClick={() => onEditJobCard(jobCard.asJson)}>
    //               <FontAwesomeIcon icon={faEdit} />
    //             </button>
    //             <button onClick={() => onViewJobCard(jobCard.asJson)}>
    //               <FontAwesomeIcon icon={faEye} />
    //             </button>
    //             <button onClick={() => onDelete(jobCard.asJson)}>
    //               <FontAwesomeIcon icon={faTrash} />
    //             </button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table> */}

    //   <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
    //     <ViewJobCardModal />
    //   </Modal>
    //   <Modal modalId={MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL}>
    //     <EditJobCardModal
    //     // id={jobCard.id}
    //     />
    //   </Modal>
    // </ErrorBoundary>

    <ErrorBoundary>
      <div className="reports uk-section">
        <div className="uk-container uk-container-xlarge background white">
          <ErrorBoundary>
            <Toolbar
              leftControls={
                <JobCardTabs
                  selectedTab={selectedTab}
                  setselectedTab={setselectedTab}
                />
              }
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={onCreateJobCard}
                    // disabled={!isEditing}
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                    Create New
                  </button>
                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      title="More Job Card Actions.">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export your scorecard as PDF.">
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export PDF
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportExcel}
                          title="Export your scorecard as EXCEL.">
                          <FontAwesomeIcon
                            icon={faFileExcel}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export Excel
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleFeedback}
                          title="Read Comments">
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Feedback
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            {!loading && selectedTab === "strategy-tab" && <JobDashboardMain />}
            {!loading && selectedTab === "department-tab" && <CreateJobCard />}
            {!loading && selectedTab === "people-tab" && <CreateJobCard />}
            {!loading && selectedTab === "execution-tab" && <AllocateJobCard />}
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL}>
        <CreateJobCard />
      </Modal>
    </ErrorBoundary>
  );
});

export default CompanyJobCard;
