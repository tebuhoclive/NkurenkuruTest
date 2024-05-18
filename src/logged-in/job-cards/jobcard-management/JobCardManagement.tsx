import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect, useState } from "react";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import useTitle from "../../../shared/hooks/useTitle";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import useBackButton from "../../../shared/hooks/useBack";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

import Toolbar from "../../shared/components/toolbar/Toolbar";
import Dropdown from "../../../shared/components/dropdown/Dropdown";
import Modal from "../../../shared/components/Modal";
import JobCardManagemntTabs from "./JobCardManagemntTabs";
import ClientAccountDetailsList from "./ClientAccountDetailsList";
import DivisionList from "./DivisionList";
import SectionList from "./SectionList";

import ClientAccountModal from "./dialogs/ClientAccountModal";
import SectionModal from "./dialogs/SectionModal";
import DivisionModal from "./dialogs/DivisionModal";
import MemberList from "./MemberList";
import MemberModal from "./dialogs/MemberModal";



const JobCardManagement = observer(() => {
  const { api, store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("accounts-tab");
  const [loading, setLoading] = useState(false);
  const scorecard = store.scorecard.active;

  useTitle("Job Card Management");
  useBackButton();

  const handleNewUser = () => {
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  };
   const handleNewMember = () => {
     showModalFromId(MODAL_NAMES.ADMIN.TEAM_MEMBER_MODAL);
   };




  const handleNewDepartment = () => {
    store.department.clearSelected(); // clear selected department
    showModalFromId(MODAL_NAMES.ADMIN.DEPARTMENT_MODAL); // show modal
  };

  const handleNewBusinessUnit = () => {
    store.businessUnit.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL); // show modal
  };
  const handleNewVM = () => {
    store.businessUnit.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.VM_MODAL); // show modal
  };

  const handleNewTheme = () => {
    store.strategicTheme.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL); // show modal
  };
  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.department.getAll();
        await api.jobcard.section.getAll();
        await api.jobcard.division.getAll();
        await api.jobcard.client.getAll();
        await api.jobcard.member.getAll();

      } catch (error) {
        // console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.businessUnit, api.department, api.user, api.jobcard.division, api.jobcard.section, api.jobcard.client, api.jobcard.member]);

  return (
    <ErrorBoundary>
      <div className="admin-settings uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                leftControls={
                  <JobCardManagemntTabs
                    selectedTab={selectedTab}
                    setselectedTab={setselectedTab}
                  />
                }
                rightControls={
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      Add
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewMember}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          Team Member
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewUser}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          Client Account
                        </button>
                      </li>

                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewDepartment}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          Section
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewBusinessUnit}>
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          Division
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            {!loading && (
              <div className="uk-margin">
                {selectedTab === "members-tab" && <MemberList />}
                {selectedTab === "section-tab" && <SectionList />}
                {selectedTab === "accounts-tab" && <ClientAccountDetailsList />}
                {selectedTab === "division-tab" && <DivisionList />}
              </div>
            )}
          </ErrorBoundary>

          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.ADMIN.USER_MODAL}>
          <ClientAccountModal />
        </Modal>
        {/* <Modal modalId={MODAL_NAMES.ADMIN.JOBCARD_USER_MODAL}>
          <JobCardModal/>
        </Modal> */}

        <Modal modalId={MODAL_NAMES.ADMIN.DEPARTMENT_MODAL}>
          <SectionModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.TEAM_MEMBER_MODAL}>
          <MemberModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL}>
          <DivisionModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});
export default JobCardManagement;
