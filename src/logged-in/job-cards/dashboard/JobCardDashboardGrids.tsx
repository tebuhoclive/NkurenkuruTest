import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import {
  IJobCard,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";

import MODAL_NAMES from "../../dialogs/ModalName";
import EditJobCardModal from "../EditJobCardModal";
import Modal from "../../../shared/components/Modal";
import "./Dashboard.css"; // Your custom styles
import ViewJobCardModal from "../ViewJobCardModal";

import DashboardCard from "./dashboard-card/DashboardCard";
import useTitle from "../../../shared/hooks/useTitle";
import useBackButton from "../../../shared/hooks/useBack";
import CreateJobCard from "../CreateJobCard";
import AllocateJobCard from "../AllocateJobCardModal";
import JobCardGridTabs from "./JobCardGridTabs";
import CreatedJobCardGrid from "../grids/CreatedJobCardGrid";
import AllocatedJobCardGrid from "../grids/AllocatedJobCardGrid";
import AllocateJobCardModal from "../AllocateJobCardModal";
import ViewAllocatedJobCardModal from "../ViewAllocatedJobCardModal ";
import MaterialTable from "../grids/MaterialTable";
import JobCardTable from "../grids/JobCardTable";
import showModalFromId from "../../../shared/functions/ModalShow";
import { moneyFormat } from "../../project-management/utils/formats";

import { getProgressColors } from "../../project-management/utils/common";
import { CircularProgressbar } from "react-circular-progressbar";

const JobCardDashboardGrids = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Job Cards");
  useBackButton();

  const JobCards = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => !job.isAllocated);
  //stats
  const totalJobcards = store.jobcard.jobcard.all.length;


  const allocatedJobCards = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.isAllocated);
  //stats
  //filter using
  const pendingJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Not Started";
  });
  const totalAllocatedJobcards = allocatedJobCards.length;

  const completedJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Completed";
  });
  const totalCompletedJobcards = completedJobcards.length;


  const onViewCreated = (selectedJobCard: IJobCard) => {
  console.log("selected job card",selectedJobCard);
  store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };

   const onViewAllocated = (selectedJobCard: IJobCard) => {
     console.log("selected job card", selectedJobCard);
     store.jobcard.jobcard.select(selectedJobCard);

     showModalFromId(MODAL_NAMES.EXECUTION.VIEWALLOCATEDJOBCARD_MODAL);
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

  return (
    <ErrorBoundary>
      <div className="uk-container uk-container-xlarge">
        {/* <h1>Job Card Dashboard</h1> */}

        {/* Job Cards Statistics */}
        <div className="basic-statistics">
          <div className="s-item">
            <div className="content">
              <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {Math.round(totalJobcards)}
              </span>
              <br />
              <span>Total Created</span>
            </div>
          </div>
          <div className="s-item">
            <div className="content">
              <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {Math.round(totalAllocatedJobcards)}
              </span>
              <br />
              <span>All Allocated</span>
            </div>
          </div>
          <div className="s-item">
            <div className="content">
              <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {Math.round(totalCompletedJobcards)}
              </span>
              <br />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* <div className="uk-child-width-expand" data-uk-grid>
          <div className="uk-child-width-expand">
            <DashboardCard
              cardValue={totalJobcards}
              cardTitle="Total"
              cardLink="/members"
              cardColour={{ background: "grey" }}
            />
          </div>
          <div className="">
            <DashboardCard
              cardValue={totalAllocatedJobcards}
              cardTitle="Allocated"
              cardLink="/members/terminated"
              cardColour={{ background: "#FF326E" }}
            />
          </div>
          <div className="">
            <DashboardCard
              cardValue={totalCompletedJobcards}
              cardTitle=" Completed"
              cardLink="/members"
              cardColour={{ background: "green" }}
            />
          </div>
        </div> */}

        <JobCardGridTabs
          selectedTab={selectedTab}
          setselectedTab={setselectedTab}
        />
        <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        <ErrorBoundary>
          {!loading && selectedTab === "strategy-tab" && (
            <>
              {" "}
              <JobCardTable
                jobCards={JobCards}
                handleEdit={onViewCreated}
                onView={onViewCreated}
                defaultPage={1} // Specify the default page number
                defaultItemsPerPage={5} // Specify the default items per page
              />
            </>
          )}
          {!loading && selectedTab === "department-tab" && (
            <JobCardTable
              jobCards={allocatedJobCards}
              handleEdit={onViewCreated}
              onView={onViewAllocated}
              defaultPage={1} // Specify the default page number
              defaultItemsPerPage={5} // Specify the default items per page
            />
          )}
          {!loading && selectedTab === "people-tab" && (
            <JobCardTable
              jobCards={completedJobcards}
              handleEdit={onViewCreated}
              onView={onViewAllocated}
              defaultPage={1} // Specify the default page number
              defaultItemsPerPage={5} // Specify the default items per page
            />
          )}
          {!loading && selectedTab === "execution-tab" && <AllocateJobCard />}
        </ErrorBoundary>
      </div>

      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
        <ViewJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL}>
        <EditJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL}>
        <AllocateJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWALLOCATEDJOBCARD_MODAL}>
        <ViewAllocatedJobCardModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default JobCardDashboardGrids;
