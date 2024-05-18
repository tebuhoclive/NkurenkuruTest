import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export type IStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Assigned"
  | "Closed"
  | "Pending"
  | "Cancelled";

export type IUrgency = "Normal" | "Urgent" | "Very Urgent"
export type IJobCardType = "Ad-hoc"|"Sewer" | "Roads" | "Building" | "General"


  export const defaultJobCard: IJobCard = {
    id: "",
    uniqueId: "",
    taskDescription: "",
    jobcardType: "General",
    jobcardCost: 0,
    dueDate: Date.now(),
    dateIssued: "",
    urgency: "Normal",
    status: "Not Started",

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
    teamMembers: [],
    remark: "",
    measure: "",
    acknowledged: false,
    reworked: ""
  };
export interface IJobCard {
  id: string;
  assignedTo: string;
  uniqueId: string;
  taskDescription: string;
  jobcardType: IJobCardType;
  jobcardCost: number;
  dueDate: number;
  dateIssued: string;
  urgency: IUrgency;
  status: IStatus;
  acknowledged: boolean;
  // scope: string;
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
  artesian: string;
  teamLeader: string;
  teamMembers?: string[];
  remark: string;
  measure: string;
  isAllocated?: boolean;
  comment?: string;
  reworked: string;
  rating?: number;
  dateCompleted?: number;
}
  export default class JobCardModel {
    private JobCard: IJobCard;
   
  
    constructor(private store: AppStore, JobCard: IJobCard) {
      makeAutoObservable(this);
      this.JobCard = JobCard;
    }
  
    get asJson(): IJobCard {
      return toJS(this.JobCard);
    }
}

