import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";

import { IDivision } from "../../../shared/models/job-card-model/Division";
import MODAL_NAMES from "../../dialogs/ModalName";

interface IProps {
  division: IDivision;
}
const DivisionItem = (props: IProps) => {
  const { division } = props;
  const { api, store } = useAppContext();

  const handleEdit = () => {
    // set selected business unit
    store.jobcard.division.selected = division;
    // show modal
    showModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL);
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove business unit?")) return; // TODO: confirmation dialog
    // remove business unit
    api.businessUnit.delete(division);
  };

  return (
    <div className="business-unit uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">Name</span>
            {division.name}
          </h6>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@m uk-text-center">
          <div className="controls">
            <button
              className="btn-icon uk-margin-small-right"
              onClick={handleEdit}>
              <span uk-icon="pencil"></span>
            </button>
            <button className="btn-icon" onClick={handleDelete}>
              <span uk-icon="trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionItem;
