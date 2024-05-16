import { Bar } from "react-chartjs-2";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";
import { useAppContext } from "../../../shared/functions/Context";
import { FC, useEffect } from "react";

interface JobCardProps {
  jobCard: IJobCard[];
}
export const JobCardBarChart: FC<JobCardProps> = ({ jobCard }) => {
  const { api, store } = useAppContext();

  useEffect(()=>{
    api.department.getAll()
  })
  const getDepartmentName = (deptId) => {
    const dept = store.department.all.find((user) => user.asJson.id === deptId);
    console.log("departments ", dept.asJson.name);
    
    return dept ? dept.asJson.name : "Unknown";
  };
  const options = {
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };
  const labels = jobCard.map((item) => getDepartmentName(item.division)); // Use map to get department names

  const data1 = {
    labels,
    datasets: [
      {
        label: "Job Card Costs",
        data: jobCard.map((p) => p.jobcardCost),
        backgroundColor: "#84cbe9",
        barPercentage: 0.2,
      },
    ],
  };
  return <Bar options={options} data={data1} />;
};
