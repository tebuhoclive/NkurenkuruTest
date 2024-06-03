import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { FormEvent, useEffect, useState } from "react";
import { IUser, defaultUser } from "../../../../shared/models/User";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
import ClientAccountForm from "./ClientAcountForm";
import { IClient, defaultClient } from "../../../../shared/models/job-card-model/Client";


const ClientAccountModal = observer(() => {
  const { api, store, ui } = useAppContext();

  const [client, setClient] = useState({ ...defaultClient });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const selected = store.jobcard.client.selected;

    if (selected) await update(client);
    else await create(client);
    setLoading(false);
    onCancel();
  };

  const update = async (client: IClient) => {
    try {
      await api.jobcard.client.update(client);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Failed to update user.",
        type: "warning",
      });
    }
  };

  const create = async (client: IClient) => {
    try {
      await api.jobcard.client.create(client);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Failed to create user.",
        type: "warning",
      });
    }
  };

  const onCancel = () => {
    // clear selected user
    store.jobcard.client.clearSelected();
    // reset form
    setClient({ ...defaultClient });
    // hide modal
    hideModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  };

  // if selected user, set form values
  useEffect(() => {
    if (store.jobcard.client.selected)
      setClient({ ...store.jobcard.client.selected });
    else setClient({ ...defaultClient });
  }, [store.jobcard.client.selected]);

  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close></button>

      <h3 className="uk-modal-title">Client Account</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid>
          <ClientAccountForm client={client} setClient={setClient} />

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}>
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ClientAccountModal;
