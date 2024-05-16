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
import DonutChart from "../charts/DonutChart";
import { useNavigate } from "react-router-dom";



const JobCardDashboardGrids = observer(() => {
    const navigate = useNavigate();
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

  const completed = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.status === "Completed");
  //stats
  const allocatedJobCards = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.isAllocated && job.status !== "Completed");
  //stats
  //filter using
  const pendingJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Not Started";
  });
  const totalPendingJobcards = pendingJobcards.length;

  const completedJobcards = store.jobcard.jobcard.all.filter((job) => {
    return job.asJson.status === "Completed";
  });
  const totalCompletedJobcards = completedJobcards.length;

  // Assuming allJobCards is an array of job cards
  const allJobCards = store.jobcard.jobcard.all;

  // Initialize an array to store time since issuance for each job card
  const timeSinceIssuanceArray: { jobCardId: string; timeDiff: number }[] = [];

  // Loop through each job card
  allJobCards.forEach((jobCard) => {
    // Convert dateIssued to a Date object
    const dateIssued = new Date(jobCard.asJson.dateIssued);
    // Get the current date
    const now = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = now.getTime() - dateIssued.getTime(); // Use getTime() to get the time in milliseconds

    // Store time difference for the current job card
    timeSinceIssuanceArray.push({ jobCardId: jobCard.asJson.id, timeDiff });
  });

  // Helper function to convert milliseconds to decimal hours
  function millisecondsToDecimalHours(ms: number): number {
    return ms / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  // Helper function to convert milliseconds to weeks
  function millisecondsToWeeks(ms: number): number {
    return ms / (1000 * 60 * 60 * 24 * 7); // Convert milliseconds to weeks
  }

  // Helper function to convert milliseconds to months
  function millisecondsToMonths(ms: number): number {
    return ms / (1000 * 60 * 60 * 24 * 30.44); // Average days in a month = 365.25 / 12
  }

  // Example usage
  timeSinceIssuanceArray.forEach(({ jobCardId, timeDiff }) => {
    const decimalHours = millisecondsToDecimalHours(timeDiff);
    const weeks = millisecondsToWeeks(timeDiff);
    const months = millisecondsToMonths(timeDiff);
    console.log(
      `Job Card ID: ${jobCardId}, Time Difference: ${decimalHours.toFixed(
        2
      )} hours, ${weeks.toFixed(2)} weeks, ${months.toFixed(2)} months`
    );
  });
 const onViewMore = () => {
   navigate(`/c/job-cards/create`);
 };
  const onViewCreated = (selectedJobCard: IJobCard) => {
    console.log("selected job card", selectedJobCard);
    store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };

  const onViewAllocated = (selectedJobCard: IJobCard) => {
    console.log("selected job card", selectedJobCard);
    store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.VIEWALLOCATEDJOBCARD_MODAL);
  };
  //donut code
 const backgroundColors = {
   pending: "rgb(255, 99, 132)", // Red
   completed: "rgb(54, 162, 235)", // Blue
   total: "rgb(255, 205, 86)", // Yellow
 };

 const data = {
   labels: ["Pending", "Completed", "Total"],
   datasets: [
     {
       label: "My First Dataset",
       data: [totalPendingJobcards, totalCompletedJobcards, totalJobcards],
       backgroundColor: [
         backgroundColors.pending,
         backgroundColors.completed,
         backgroundColors.total,
       ],
       hoverOffset: 4,
     },
   ],
   datalabels: {
     color: "#fff", // Adjust the color as needed
     formatter: (value, context) => {
       return context.chart.data.labels[context.dataIndex];
     },
   },
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

        <div className="uk-form uk-grid uk-grid-small" data-uk-grid>
          <div className="uk-width-1-3">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Donut Chart</h3>
              <div className="content">
                <DonutChart chartData={data} />
              </div>
            </div>
          </div>
          <div className="uk-width-expand">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">NOT YET ADDED</h3>
              <div
                className="content"
                style={{ width: "300px", height: "440px" }}></div>
            </div>
          </div>
        </div>

        {/* Job Cards Statistics */}

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
                timeSinceIssuanceArray={timeSinceIssuanceArray}
                onViewMoreClick={onViewMore}
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
              timeSinceIssuanceArray={timeSinceIssuanceArray}
              onViewMoreClick={onViewMore}
            />
          )}
          {!loading && selectedTab === "people-tab" && (
            <JobCardTable
              jobCards={completed}
              handleEdit={onViewCreated}
              onView={onViewAllocated}
              defaultPage={1} // Specify the default page number
              defaultItemsPerPage={5} // Specify the default items per page
              timeSinceIssuanceArray={timeSinceIssuanceArray}
              onViewMoreClick={onViewMore}
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
