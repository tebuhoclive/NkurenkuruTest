import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import {
  IJobCard,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import { defaultTask } from "../../../shared/models/ProjectTasks";
import { useAppContext } from "../../../shared/functions/Context";
import { ITask } from "../../../shared/models/Task";
import { ITool, defaultTool } from "../../../shared/models/job-card-model/Tool";
import {
  IMaterial,
  defaultMaterial,
} from "../../../shared/models/job-card-model/Material";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";

const OnEditMaterial = observer(() => {
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

  const [createMode, setCreateMode] = useState(true);
  const [render, setRender] = useState(false);
  const [tool, setTool] = useState<ITool>({ ...defaultTool });
  const [material, setMaterial] = useState<IMaterial>({ ...defaultMaterial });

  //handle  tasks removal, addition,updating

  const onUpdateMaterial = (updatedMaterial: IMaterial) => {
    setRender(true);
    // Assuming store.jobcard.material.select() is available
    store.jobcard.material.select(updatedMaterial);

    const selectedMaterial = store.jobcard.material.selected;
    if (selectedMaterial) {
      setMaterial(selectedMaterial);
      setCreateMode(false);
    }
  };
console.log("material selected ", material);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
     
      await api.jobcard.material.update( material, jobCard.id
        // jobCard.id
      );

      // Clear the form
      setMaterial({ ...defaultMaterial });
    } catch (error) {
      // Handle error appropriately
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Make sure to reset loading state regardless of success or failure
      onCancel();
    }
  };

  const onCancel = () => {
    store.jobcard.material.clearSelected();
    setMaterial({ ...defaultMaterial });
    hideModalFromId(MODAL_NAMES.EXECUTION.ONEDITMATERIAL_MODAL);
  };

  useEffect(() => {
    if (store.jobcard.material.selected) {
      setMaterial(store.jobcard.material.selected);

    }
    if(store.jobcard.jobcard.selected){
      setJobCard(store.jobcard.jobcard.selected)
    }
  }, [store.jobcard.jobcard.selected, store.jobcard.material.selected]);

  useEffect(() => {
    if (store.jobcard.material.selected) {
      const loadData = async () => {
        try {
          // Fetch job card details
     
          const selectedJobCard = store.jobcard.jobcard.selected;

          if (selectedJobCard) {
            // Fetch data for subcollections
  
            await api.jobcard.material.getAll(selectedJobCard.id);
          
          
           
       
          } else {
            console.error("Job card not found.");
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };

      loadData();
    }
  }, [api.jobcard.jobcard, api.jobcard.material, store.jobcard.jobcard.selected, store.jobcard.material.selected]);

  return (
    <div
      className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "60%" }}>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close></button>
      <h3 className="uk-modal-title text-to-break">Add Material</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small"
          style={{ justifyContent: "center" }}
          uk-grid
          onSubmit={handleSubmit}>
          <p>Please Add the material for your job card </p>

          <div>
            <div>
              <h3 className="uk-card-title">
                {createMode ? "Add Material" : "Edit Material"}
              </h3>
              <div className="uk-margin">
                {/* Exclude input field for 'id' property */}
                <label>Material Name</label>
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Material Name"
                  value={material.name}
                  onChange={(e) =>
                    setMaterial({
                      ...material,
                      name: e.target.value,
                    })
                  }
                />
                <label>Unit cost</label>
                <input
                  className="uk-input"
                  type="number"
                  placeholder="Enter material unit cost"
                  value={material.unitCost}
                  onChange={(e) =>
                    setMaterial({
                      ...material,
                      unitCost: e.target.valueAsNumber,
                    })
                  }
                />
                <label>Quantity</label>
                <input
                  className="uk-input"
                  type="number"
                  placeholder="Enter material quantity"
                  value={material.quantity}
                  onChange={(e) =>
                    setMaterial({
                      ...material,
                      quantity: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              <hr />
            </div>
          </div>

          <div
            className="uk-width-1-1 uk-text-right"
            style={{ marginTop: "20px" }}>
            <div
              className="uk-width-1-1 uk-text-right"
              style={{ marginTop: "10px" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}>
                Save{" "}
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default OnEditMaterial;
