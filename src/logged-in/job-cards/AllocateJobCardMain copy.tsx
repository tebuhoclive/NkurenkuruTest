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

import CreateJobCardModal from "./dialogs/CreateJobCardModal";
import AllocateJobCardModal from "./dialogs/AllocateJobCardModal";

import { IJobCard } from "../../shared/models/job-card-model/Jobcard";

import AllocatedSubTabs from "./dashboard/AllocatedSubTabs";
import ViewAllocatedJobCardModal from "./dialogs/ViewAllocatedJobCardModal ";
import AllocatedJobCardTable from "./grids/AllocatedJobCardTable ";
import UnallocatedJobCardTable from "./grids/UnallocatedJobCardTable";


const AllocateJobCardMain = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };


  //stats

  const createdJobCards = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.isAllocated !== true);
  //stats
  const allocatedJobCards = store.jobcard.jobcard.all
    .map((job) => job.asJson)
    .filter((job) => job.isAllocated && job.status === "In Progress");

  const onCreateJobCard = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL);
  };

  const [selectedTab, setselectedTab] = useState("strategy-tab");
  const [selectedSubTab, setselectedSubTab] = useState("inprogress-tab");
  useTitle("Allocated Job Cards");
  useBackButton();
  const [isOpen, setIsOpen] = useState(false);


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

  const onViewCreated = (selectedJobCard: IJobCard) => {
    console.log("selected job card", selectedJobCard);
    store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };

  const onViewMore = () => {
    navigate(`/c/job-cards/create`);
  };
  const onViewAllocated = (selectedJobCard: IJobCard) => {
    console.log("selected job card", selectedJobCard);
    store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.VIEWALLOCATEDJOBCARD_MODAL);
  };

  //code for time since created

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

  //rating code 
   const [ratings, setRatings] = useState({});
  //  useEffect(() => {
  //    // Initialize ratings from completed job cards
  //    const initialRatings = {};
  //    completed.forEach((jobCard) => {
  //      initialRatings[jobCard.id] = jobCard.rating || 0;
  //    });
  //    setRatings(initialRatings);
  //  }, [completed]);

   const handleRatingChange = (jobCardId, newRating) => {
     setRatings({
       ...ratings,
       [jobCardId]: newRating,
     });
     // Optionally, update the rating on the server or in the job card object
   };

  return (
    <ErrorBoundary>
      <div className="reports uk-section">
        <div className="uk-container uk-container-xlarge background white">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <JobCardTabs
                  selectedTab={selectedTab}
                  setselectedTab={setselectedTab}
                />
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            {!loading && selectedTab === "strategy-tab" && (
              <>
                <div className="uk-width-1-1">
                  {" "}
                  <h4 className="uk-text-bold">Unallocated Queue</h4>
                </div>{" "}
                <UnallocatedJobCardTable
                  jobCards={createdJobCards}
                  handleEdit={onViewCreated}
                  onView={onViewCreated}
                  defaultPage={1} // Specify the default page number
                  defaultItemsPerPage={5} // Specify the default items per page
                  timeSinceIssuanceArray={timeSinceIssuanceArray}
                />
              </>
            )}
            {!loading && selectedTab === "department-tab" && (
              <>
                <div className="uk-width-1-1">
                  <h4 className="uk-text-bold">Allocated Queue</h4>
                </div>{" "}
                <AllocatedSubTabs
                  selectedTab={selectedSubTab}
                  setselectedTab={setselectedSubTab}
                />
                {!loading && selectedSubTab === "inprogress-tab" && (
                  <AllocatedJobCardTable
                    jobCards={allocatedJobCards}
                    handleEdit={onViewCreated}
                    onView={onViewAllocated}
                    defaultPage={1} // Specify the default page number
                    defaultItemsPerPage={5} // Specify the default items per page
                    timeSinceIssuanceArray={timeSinceIssuanceArray}
                  />
                )}
              
                {!loading && selectedSubTab === "deleted-tab" && (
                  <AllocatedJobCardTable
                    jobCards={createdJobCards}
                    handleEdit={onViewCreated}
                    onView={onViewAllocated}
                    defaultPage={1} // Specify the default page number
                    defaultItemsPerPage={5} // Specify the default items per page
                    timeSinceIssuanceArray={timeSinceIssuanceArray}
                  />
                )}
              </>
            )}
            {!loading && selectedTab === "people-tab" && <CreateJobCardModal />}
            {!loading && selectedTab === "execution-tab" && (
              <AllocateJobCardModal />
            )}
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL}>
        <CreateJobCardModal />
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

export default AllocateJobCardMain;
