import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../shared/functions/Context";
import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import useBackButton from "../../shared/hooks/useBack";
import showModalFromId from "../../shared/functions/ModalShow";
import MODAL_NAMES from "../dialogs/ModalName";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import JobCardTabs from "./dashboard/JobCardTabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import JobCardReports from "./JobCardReports";

import CreateJobCardModal from "./dialogs/CreateJobCardModal";
import AllocateJobCardModal from "./dialogs/AllocateJobCardModal";

import { IJobCard } from "../../shared/models/job-card-model/Jobcard";

import AllocatedSubTabs from "./dashboard/AllocatedSubTabs";
import ViewAllocatedJobCardModal from "./dialogs/ViewAllocatedJobCardModal ";
import DonutChart from "./charts/DonutChart";
import { CircularProgressbar } from "react-circular-progressbar";
import JobCardGridTabs from "./dashboard/JobCardGridTabs";
import JobCardTableViewMoreRecent from "./grids/JobCardTableViewMoreRecent";
import JobCardTableViewMoreOld from "./grids/JobCardTableViewMoreOld";

import UpdatedJobCardModal from "./dialogs/UpdateJobCardModal";
import JobCardTable from "./grids/DashboardJobCardTable";

const CreatedJoCardMain = observer(() => {
  const navigate = useNavigate();
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Created Job Cards");
  useBackButton();

  const me = store.auth.meJson;
  const totalJobcards = store.jobcard.jobcard.all.length;

  const completed = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.status === "Completed");
  //stats
  const createdJobCards = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.isAllocated !== true);
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

  const onCreateJobCard = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL);
  };
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
      <div className="reports uk-section">
        <div className="uk-container uk-container-xlarge background white">
          <ErrorBoundary>
            <Toolbar
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
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <div className="uk-grid uk-grid-small" data-uk-grid>
              <div className="uk-width-1-2">
                {/* First column with body cards */}
                {/* Example content */}
                <p className="uk-text-bold">Recently Added Job cards</p>
                <JobCardTableViewMoreRecent
                  jobCards={createdJobCards}
                  handleEdit={onViewCreated}
                  onView={onViewAllocated}
                  defaultPage={1} // Specify the default page number
                  defaultItemsPerPage={5} // Specify the default items per page
                  timeSinceIssuanceArray={timeSinceIssuanceArray}
                  onViewMoreClick={onViewMore}
                />
              </div>
              <div className="uk-width-1-2">
                {/* Second column with body cards */}

                {/* Example content */}
                <p className="uk-text-bold">Job Cards Older than 1 Day </p>
                <JobCardTableViewMoreOld
                  jobCards={allocatedJobCards}
                  handleEdit={onViewCreated}
                  onView={onViewAllocated}
                  defaultPage={1} // Specify the default page number
                  defaultItemsPerPage={5} // Specify the default items per page
                  timeSinceIssuanceArray={timeSinceIssuanceArray}
                  onViewMoreClick={onViewMore}
                />
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Job Cards Statistics */}

      <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>

      {/* <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
        <ViewJobCardModal />
      </Modal> */}
      <Modal modalId={MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL}>
        <UpdatedJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL}>
        <AllocateJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWALLOCATEDJOBCARD_MODAL}>
        <ViewAllocatedJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL}>
        <CreateJobCardModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default CreatedJoCardMain;
