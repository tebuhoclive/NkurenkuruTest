import { observer } from "mobx-react-lite";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect, useMemo, useState } from "react";
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
import SingleSelect, {
  IOption,
} from "../../../shared/components/single-select/SingleSelect";
import BarChart from "../Components/BarChart";
import CostChart from "../Components/CostChart";
import SparklineChart from "../Components/SparklineChart";

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

  const users = store.user.all;

  const userOptions: IOption[] = useMemo(
    () =>
      users.map((bu) => {
        return {
          label: bu.asJson.displayName || "",
          value: bu.asJson.uid,
        };
      }),
    [users]
  );
  //donut code
  const backgroundColors = {
    pending: "rgb(255, 99, 132)", // Red
    completed: "rgb(54, 162, 235)", // Blue
    total: "rgb(255, 205, 86)", // Yellow
  };
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  // Function to handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    const selectedName = store.user.getById(userId).asJson.displayName;
    setSelectedUser(selectedName);
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
  const [jobCardData, setJobCardData] = useState({
    total: 100,
    pending: 30,
    completed: 60,
    overdue: 10,
  });
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.jobcard.jobcard.getAll();
        await api.jobcard.section.getAll();
        await api.user.getAll();

        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.jobcard, api.user]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="uk-container uk-container-xlarge">
        <div className="uk-grid-small uk-grid-match" data-uk-grid>
          <div className="uk-width-1-3@m">
            <div className="">
              <h3 className="uk-text-bold">Water</h3>
              <BarChart />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <h3 className="uk-text-bold">Sewage</h3>
              <BarChart />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <h3 className="uk-text-bold">Cleaners</h3>
              <BarChart />
            </div>
          </div>
          <div className="uk-width 1-1">
            {" "}
            <h3 className="uk-text-bold">Cost</h3>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <CostChart />
            </div>
          </div>{" "}
          <div className="uk-width-1-3@m">
            <div className="">
              <CostChart />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <CostChart />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
             
              <SparklineChart />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
            
              <SparklineChart />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
           
              <SparklineChart />
            </div>
          </div>
        </div>

        <div className="uk-grid-small uk-grid-match" data-uk-grid>
          <div className="uk-width-1-3@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-text-bold">Overview</h3>
              <DonutChart chartData={data} />
            </div>
          </div>
          <div className="uk-width-expand@m">
            <div className="uk-card uk-card-default uk-card-body">
              <div className="uk-grid-small uk-grid-match" data-uk-grid>
                <div
                  className="uk-form-controls uk-width-1-3 "
                  style={{ marginLeft: "2px" }}>
                  <label className="uk-form-label" htmlFor="division">
                    Select User to see Performance
                  </label>
                  {/* Place the SingleSelect component here */}
                  <SingleSelect
                    name="search-team"
                    options={userOptions}
                    // width="250px"
                    onChange={handleUserSelect}
                    placeholder="Assign "
                    value={selectedUserId}
                    required
                  />
                </div>
                <div className="uk-width 1-1">
                  <AssignedUserJobCardStats
                    userId={selectedUserId}
                    userName={selectedUser}
                    jobCards={allJobCards}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-width 1-3">
          <SectionJobCardStats sections={sections} jobCards={allJobCards} />
        </div>

        <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        <div className="uk-margin-top uk-width-1-2@"> </div>
      </div>
    </ErrorBoundary>
  );
});

export default JobCardDashboard;
