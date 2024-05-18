import { useState } from "react";
import { IUser } from "../../../shared/models/User";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import { IClient } from "../../../shared/models/job-card-model/Client";


interface IProps {
  client: IClient;
}

const ClientAccountItem = (props: IProps) => {
  const { api, store } = useAppContext();

  const [loading, setLoading] = useState(false);

  const { client } = props;

 const cssClass = client.id ? "user" : "user user__not-verified";

  const handleEdit = () => {
    store.jobcard.client.select(client); // set selected user
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL); // show modal
  };

  //  const handleEditJobCard = () => {
  //    store.user.select(u); // set selected user
  //    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL); // show modal
  //  };

  const disableDB = async () => {
    setLoading(true);

    try {
      await api.jobcard.client.update(client);
    } catch (error) {}
    setLoading(false);
  };

  const enableDB = async () => {
    setLoading(true);
    try {
      await api.jobcard.client.update(client);
    } catch (error) {}
    setLoading(false);
  };

  // const handleDisable = async () => {
  //   setLoading(true);
  //   try {
  //     await api.user.disable(user);
  //   } catch (error) { }
  //   setLoading(false);
  // };

  // const handleEnable = async () => {
  //   setLoading(true);
  //   try {
  //     await api.user.enable(user);
  //   } catch (error) { }
  //   setLoading(false);
  // };

  // const handleVerify = async () => {
  //   if (!window.confirm("Verify user?")) return; // TODO: confirmation dialog
  //   try {
  //     await api.user.update({ ...user, userVerified: true }); // update user
  //     // TODO: notify user (success snackbar)
  //   } catch (error) {
  //     // TODO: error handling
  //     console.log(error);
  //   }
  // };

  return (
    <div
      className={`${cssClass} uk-card uk-card-default uk-card-body uk-card-small`}>
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">name</span>
            {client.name}
          </h6>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label">Email</span>
            {client.email || "-"}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label">Mobile Number</span>
            {client.mobileNumber || "-"}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="department-name">
            <span className="span-label">City</span>
            {client.city || "-"}
          </p>
        </div>

        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-1-6@m uk-text-right">
          <div className="controls">
            <button className="btn-icon" title="Edit" onClick={handleEdit}>
              <span data-uk-icon="pencil"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAccountItem;
