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
import MonthFilter from "../Components/MonthFilter";
import "./Dashboard.css"; // Assuming you have a separate CSS file for styling

const JobCardDashboard = observer(() => {
  const navigate = useNavigate();
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Job Card Dashboard");
  useBackButton();

  const me = store.auth.meJson;


  // const section=store.jobcard.section.all
  //  const division = store.jobcard.division.all;
  //  const jobcards = store.jobcard.jobcard.all;
  const totalJobcards = store.jobcard.jobcard.all.length;

  // const completed = store.jobcard.jobcard.all
  //   .map((job) => job.asJson)
  //   .filter((job) => job.status === "Completed");
  // //stats
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
// new code 

  //  const handleMonthChange = (month) => {
  //    setSelectedMonth(month);
  //  };
const section = store.jobcard.section.all;
const jobcards = store.jobcard.jobcard.all;





const firstSectionId = section.length > 0 ? sections[4] : null;

const secondSectionId = section.length > 0 ? sections[3]: null;
const thirdSectionId = section.length > 0 ? sections[2]: null;
 const sectionId = sections.length > 0 ? sections[0]: null;

const filterJobCardsBySection = (sectionId) => {
  // Find the divisions corresponding to the given section
  const divisionsInSection = section.filter(
    (division) => division.asJson.division === sectionId
  );

  // Filter the job cards based on the found divisions
  const filteredJobCards = jobcards.filter((jobCard) =>
    divisionsInSection.some(
      (division) => division.asJson.division === jobCard.asJson.division
    )
  );

  // Count the completed, pending, and overdue job cards
  const pending = filteredJobCards.filter(
    (jobCard) => jobCard.asJson.status === "Not Started"
  ).length;

  const completed = filteredJobCards.filter(
    (jobCard) => jobCard.asJson.status === "Completed"
  ).length;

  const overdue = filteredJobCards.filter((jobCard) => {
    const jobDate = new Date(jobCard.asJson.dueDate);
    return jobCard.asJson.status !== "Completed" && jobDate < new Date();
  }).length;

  const total = filteredJobCards.length;
  // Calculate the total cost of the filtered job cards
  const totalCost = filteredJobCards.reduce(
    (sum, jobCard) => sum + jobCard.asJson.jobcardCost,
    0
  );

  return { total, pending, completed, overdue, totalCost };
};




 const jobCardData = firstSectionId?.division
   ? filterJobCardsBySection(firstSectionId?.division)
   : { total: 0, pending: 0, completed: 0, overdue: 0,totalCost:0  };

const jobCardData1 = secondSectionId?.division
  ? filterJobCardsBySection(secondSectionId?.division)
  : { total: 0, pending: 0, completed: 0, overdue: 0,totalCost:0  };

  const jobCardData2 = thirdSectionId?.division
    ? filterJobCardsBySection(thirdSectionId?.division)
    : { total: 0, pending: 0, completed: 0, overdue: 0,totalCost:0 };






 const getDivisionName = (divisionId) => {
   const division = store.jobcard.division.all.find(
     (unit) => unit.asJson.id === divisionId
   );
   return division ? division.asJson.name : "Unknown";
 };

 const getSectionName = (secId) => {
   const section = store.jobcard.section.all.find(
     (section) => section.asJson.id === secId
   );
   return section ? section.asJson.name : "Unknown";
 };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.jobcard.jobcard.getAll();
        await api.jobcard.section.getAll();
         await api.jobcard.division.getAll();
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
            <div className="department-job-cards">
              <h3 className="uk-text-bold">Tax Collection</h3>

              <BarChart
                title={getSectionName(sectionId?.id)}
                data={[
                  jobCardData.total,
                  jobCardData.pending,
                  jobCardData.completed,
                  jobCardData.overdue,
                ]}
                labels={["Total Job Cards", "Pending", "Completed", "Overdue"]}
                backgroundColors={[
                  "#007bff", // Blue for Total Job Cards
                  "#ffc107", // Yellow for Pending
                  "#28a745", // Green for Completed
                  "#dc3545", // Red for Overdue
                ]}
              />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <h3 className="uk-text-bold">Sewage</h3>
              <BarChart
                title={getSectionName(secondSectionId?.id)}
                data={[
                  jobCardData1.total,
                  jobCardData1.pending,
                  jobCardData1.completed,
                  jobCardData1.overdue,
                ]}
                labels={["Total Job Cards", "Pending", "Completed", "Overdue"]}
                backgroundColors={[
                  "#007bff", // Blue for Total Job Cards
                  "#ffc107", // Yellow for Pending
                  "#28a745", // Green for Completed
                  "#dc3545", // Red for Overdue
                ]}
              />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <h3 className="uk-text-bold">Cleaners</h3>
              <BarChart
                title={getSectionName(thirdSectionId?.id)}
                data={[
                  jobCardData2.total,
                  jobCardData2.pending,
                  jobCardData2.completed,
                  jobCardData2.overdue,
                ]}
                labels={["Total Job Cards", "Pending", "Completed", "Overdue"]}
                backgroundColors={[
                  "#007bff", // Blue for Total Job Cards
                  "#ffc107", // Yellow for Pending
                  "#28a745", // Green for Completed
                  "#dc3545", // Red for Overdue
                ]}
              />
            </div>
          </div>
          <div className="uk-width 1-1">
            {" "}
            <h3 className="uk-text-bold">Cost</h3>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <CostChart totalCost={jobCardData.totalCost} />
            </div>
          </div>{" "}
          <div className="uk-width-1-3@m">
            <div className="">
              <CostChart totalCost={jobCardData1.totalCost} />
            </div>
          </div>
          <div className="uk-width-1-3@m">
            <div className="">
              <CostChart totalCost={jobCardData2.totalCost} />
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
