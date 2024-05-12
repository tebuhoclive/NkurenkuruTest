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

const JobCardDashboardGrids = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Job Cards");
  useBackButton();

  // const onViewJobCard = (jobCard: IJobCard) => {
  //   store.jobcard.jobcard.select(jobCard);

  //   showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  // };

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

  const allocatedJobCards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.isAllocated === true;
  });
  //filter using
  const pendingJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Not Started";
  });
  const totalPendingJobcards = pendingJobcards.length;

  const completedJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Completed";
  });
  const totalCompletedJobcards = completedJobcards.length;

  // const handleAcknowledge = async (jobCard: IJobCard) => {
  //   // If user clicks "Record", proceed with acknowledgment
  //   try {
  //     const updatedJobCard: IJobCard = {
  //       ...jobCard,
  //       acknowledged: true,
  //     };

  //     // Assuming that `api.jobcard.jobcard.update` method accepts the job card ID and the updated data
  //     await api.jobcard.jobcard.update(updatedJobCard);

  //     // Call any additional logic or UI updates as needed after a successful acknowledgment

  //     // Optionally, show a success message
  //     swal({
  //       title: "Acknowledged!",
  //       icon: "success",
  //     });
  //   } catch (error) {
  //     console.log("Error: " + error);
  //     // Handle error appropriately
  //   }
  // };

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

        <div className="uk-child-width-expand" data-uk-grid>
          <div className="uk-child-width-expand">
            <DashboardCard
              cardValue={totalJobcards}
              cardTitle="Created"
              cardLink="/members"
              cardColour={{ background: "grey" }}
            />
          </div>
          <div className="">
            <DashboardCard
              cardValue={totalPendingJobcards}
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
        </div>

        <JobCardGridTabs
          selectedTab={selectedTab}
          setselectedTab={setselectedTab}
        />
        <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        <ErrorBoundary>
          {!loading && selectedTab === "strategy-tab" && (
            <CreatedJobCardGrid data={Jobcards} />
          )}
          {!loading && selectedTab === "department-tab" && (
            <AllocatedJobCardGrid data={allocatedJobCards} />
          )}
          {!loading && selectedTab === "people-tab" && <CreateJobCard />}
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
    </ErrorBoundary>
  );
});

export default JobCardDashboardGrids;
