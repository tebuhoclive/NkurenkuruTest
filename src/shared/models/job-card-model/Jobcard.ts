import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export type IStatus = "Not Started" | "In Progress" | "Completed" | "Assigned" | "Closed"
export type IUrgency = "Normal" | "Urgent" | "Very Urgent"
export type IJobCardType = "Ad-hoc"|"Sewer" | "Roads" | "Building" | "General"


  export const defaultJobCard: IJobCard = {
    id: "",
    uniqueId: "",
    jobDescription: "",
    jobcardType: "General",
    jobcardCost: 0,
    dueDate: "",
    dateIssued: "",
    urgency: "Normal",
    status: "Not Started",
    acknowledged: false,
    overallTime: 0,
    scope: "",
    objectives: "",
    expectedOutcomes: "",
    division: "",
    section: "",
    clientFullName: "",
    clientTelephone: "",
    clientMobileNumber: "",
    clientAddress: "",
    clientEmail: "",
    erf: "",
    typeOfWork: "",
    assignedTo: "",
    artesian: "",
    teamLeader: "",
    teamMember: "",
    remark: ""
  };
export interface IJobCard {
  id: string;
  assignedTo: string;
  uniqueId: string;
  jobDescription: string;
  jobcardType: IJobCardType;
  jobcardCost: number;
  dueDate: string;
  dateIssued: string;
  urgency: IUrgency;
  status: IStatus;
  acknowledged: boolean;
  overallTime: number;
  scope: string;
  objectives: string;
  expectedOutcomes: string;
  division: string;
  section: string;
  clientFullName: string;
  clientTelephone: string;
  clientMobileNumber: string;
  clientAddress: string;
  clientEmail: string;
  erf: string;
  typeOfWork: string;
  artesian:string;
  teamLeader:string;
  teamMember:string;
  remark:string;
}
  export default class JobCardModel {
    private JobCard: IJobCard;
    status: string | number | readonly string[] | undefined;
  
    constructor(private store: AppStore, JobCard: IJobCard) {
      makeAutoObservable(this);
      this.JobCard = JobCard;
    }
  
    get asJson(): IJobCard {
      return toJS(this.JobCard);
    }
}