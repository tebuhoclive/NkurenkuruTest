import { runInAction } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import { IMaterial } from "../../models/job-card-model/Material";


export default class MaterialStore extends Store<IMaterial, IMaterial> {
  items = new Map<string, IMaterial>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IMaterial[] = []) {
    runInAction(() => {
      items.forEach((item) => this.items.set(item.id, item));
    });
  }
}
