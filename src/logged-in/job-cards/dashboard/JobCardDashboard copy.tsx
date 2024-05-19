import { observer } from "mobx-react-lite";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect, useState } from "react";
import useBackButton from "../../../shared/hooks/useBack";
import useTitle from "../../../shared/hooks/useTitle";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import DonutChart from "../charts/DonutChart";
import JobCardGridTabs from "./JobCardGridTabs";
import SectionJobCardStats from "../Components/SectionJobCardStats";
import AssignedUserJobCardStats from "../Components/AssignedUserJobCardStats";

const JobCardDashboard = observer(() => {
  const navigate = useNavigate();
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Job Card Dashboard");
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
  const allJobCards = store.jobcard.jobcard.all.map(
    (jobCard) => jobCard.asJson
  );
  const sections = store.jobcard.section.all.map((section) => section.asJson);

  // Initialize an array to store time since issuance for each job card
  const timeSinceIssuanceArray: { jobCardId: string; timeDiff: number }[] = [];

  // Loop through each job card
  // allJobCards.forEach((jobCard) => {
  //   // Convert dateIssued to a Date object
  //   const dateIssued = new Date(jobCard.asJson.dateIssued);
  //   // Get the current date
  //   const now = new Date();

  //   // Calculate the time difference in milliseconds
  //   const timeDiff = now.getTime() - dateIssued.getTime(); // Use getTime() to get the time in milliseconds

  //   // Store time difference for the current job card
  //   timeSinceIssuanceArray.push({ jobCardId: jobCard.asJson.id, timeDiff });
  // });

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

  const value = totalCompletedJobcards / totalJobcards;

  const percentage = Math.round(value * 100);

  const totalPendingJobCards = pendingJobcards.length;
  const totalAllocatedJobcards = allocatedJobCards.length;

  //donut code
  const backgroundColors = {
    pending: "rgb(255, 99, 132)", // Red
    completed: "rgb(54, 162, 235)", // Blue
    total: "rgb(255, 205, 86)", // Yellow
  };
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Function to handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
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
        await api.jobcard.section.getAll();

        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.jobcard]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="uk-container uk-container-xlarge">
        <div className="uk-form uk-grid uk-grid-small" data-uk-grid>
          <div className="uk-width-1-3">
            <div className="uk-card uk-card-default uk-card-body">
              {/* Content for the first card */}
              <div className="content">
                <h3>Overview</h3>
                <DonutChart chartData={data} />
              </div>
            </div>
          </div>
          <div className="uk-width-expand" style={{ height: "500px" }}>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{ height: "520px" }}>
              {/* Content for the second card */}
              <div
                className="uk-position-center uk-padding"
                style={{ width: "300px", height: "290px" }}>
                {/* Your content here */}
                <CircularProgressbar
                  value={percentage}
                  maxValue={1}
                  text={`${percentage} % Resolved`}
                  styles={{
                    text: { fontSize: ".6rem" },
                  }}
                />
              </div>{" "}
              <section>
                <span style={{ fontSize: "1.5rem" }}>
                  {" "}
                  {/* Increase the font size to 1.5rem */}
                  <b>Status</b>
                </span>

                <ul className="uk-list">
                  <li style={{ color: "#dc3545", fontSize: "1.2rem" }}>
                    {" "}
                    {/* Increase the font size to 1.2rem */}
                    Not Started: <b>{totalPendingJobCards}</b>
                  </li>
                  <li style={{ color: "#faa05a", fontSize: "1.2rem" }}>
                    {" "}
                    {/* Increase the font size to 1.2rem */}
                    In progress: <b>{totalAllocatedJobcards}</b>
                  </li>
                  <li style={{ color: "#4bb543", fontSize: "1.2rem" }}>
                    {" "}
                    {/* Increase the font size to 1.2rem */}
                    Resolved: <b>{totalCompletedJobcards}</b>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>

        <ErrorBoundary>
          <div className="uk-grid uk-grid-small" data-uk-grid>
            <div className="uk-width-1-1">
              {/* First column with body cards */}
              <SectionJobCardStats sections={sections} jobCards={allJobCards} />
            </div>
            <div className="uk-width-1-2"> </div>
          </div>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default JobCardDashboard;
