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
import ClientAccountModal from "./dialogs/ClientAccountModal";
import SectionModal from "./dialogs/SectionModal";
import DivisionModal from "./dialogs/DivisionModal";
import TeamMemberJobCardTable from "./grids/TeamMemberJobCardTable";
import { ITeamMember } from "../../../shared/models/job-card-model/TeamMember";
import SectionJobCardTable from "./grids/SectionJobCardTable";
import DivisionJobCardTable from "./grids/DivisionJobCardTable";
import BlueButton from "../create-jobcard/Button";
import { ISection } from "../../../shared/models/job-card-model/Section";
import { IClient } from "../../../shared/models/job-card-model/Client";
import MemberModal from "./dialogs/MemberModal";
import { IDivision } from "../../../shared/models/job-card-model/Division";


const JobCardManagement = observer(() => {
  const { api, store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("client-tab");
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
  const onViewCreatedClient = (selectedClient: IClient) => {
    console.log("selected job card", selectedClient);
    store.jobcard.client.select(selectedClient);

    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  };
  const onViewTeamMember = (selectedTeamMember: ITeamMember) => {
    console.log("selected job card", selectedTeamMember);
    store.jobcard.teamMember.select(selectedTeamMember);

    showModalFromId(MODAL_NAMES.ADMIN.TEAM_MEMBER_MODAL);
  };
 const onViewDivision = (selectedDivision: IDivision) => {
   console.log("selected job card", selectedDivision);
   store.jobcard.division.select(selectedDivision);

   showModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL);
 };


   const teamMemberList = store.jobcard.teamMember.all.map(
     (teamMember) => teamMember.asJson
   );
     const sectionList = store.jobcard.section.all.map(
       (section) => section.asJson
     );
       const devisionList = store.jobcard.division.all.map(
         (section) => section.asJson
       );
   
   const clients = store.jobcard.client.all.map((clients) => clients.asJson);


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
        await api.jobcard.teamMember.getAll();

      } catch (error) {
        // console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.businessUnit, api.department, api.user, api.jobcard.division, api.jobcard.section, api.jobcard.client, api.jobcard.teamMember]);



  
  // new handling function 

   const handleEditSection = (section:ISection) => {
     store.jobcard.section.select(section); // set selected department
     showModalFromId(MODAL_NAMES.ADMIN.DEPARTMENT_MODAL); // show modal
   };

   const handleDeleteSection = async (section: ISection) => {
     if (!window.confirm("Remove department?")) return; // TODO: confirmation dialog
     api.jobcard.section.delete(section); // remove department
   };

    const handleEditTeamMember = (teamMember:ITeamMember) => {
      store.jobcard.teamMember.select(teamMember); // set selected user
      showModalFromId(MODAL_NAMES.ADMIN.TEAM_MEMBER_MODAL); // show modal
    };

    const handleArchive = (teamMember) => {
      // Your logic to archive the team member
      console.log(`Archiving team member: ${teamMember.name}`);
      // Add your archive functionality here
    };
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
                    setSelectedTab={setselectedTab}
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
                {selectedTab === "team-members-tab" && (
                  <TeamMemberJobCardTable
                    teamMembers={teamMemberList}
                    handleEdit={handleEditTeamMember}
                    handleArchive={handleArchive}
                    defaultPage={1} // Specify the default page number
                    defaultItemsPerPage={5} // Specify the default items per page
                  />
                )}
                {selectedTab === "sections-tab" && (
                  <SectionJobCardTable
                    section={sectionList}
                    handleEdit={handleEditSection}
                    onView={handleDeleteSection}
                    defaultPage={1} // Specify the default page number
                    defaultItemsPerPage={5} // Specify the default items per page
                  />
                )}
                {selectedTab === "client-tab" && (
                  <TeamMemberJobCardTable
                    teamMembers={clients}
                    handleEdit={onViewCreatedClient}
                    handleArchive={handleArchive}
                    defaultPage={1} // Specify the default page number
                    defaultItemsPerPage={5} // Specify the default items per page
                  />
                )}
                {selectedTab === "division-tab" && (
                  <DivisionJobCardTable
                    section={devisionList}
                    handleEdit={onViewDivision}
                    onView={onViewDivision}
                    defaultPage={1} // Specify the default page number
                    defaultItemsPerPage={5} // Specify the default items per page
                  />
                )}
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
