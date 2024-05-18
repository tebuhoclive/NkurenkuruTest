import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";



export const defaultDivision: IDivision = {
  id: "",
  name: "",
};

export interface IDivision {
  id: string;
  name: string;
}


export class Division {
  private division: IDivision;

  constructor(private store: AppStore, division: IDivision) {
    makeAutoObservable(this);
    this.division = division;
  }

  get asJson(): IDivision {
    return toJS(this.division);
  }
}


