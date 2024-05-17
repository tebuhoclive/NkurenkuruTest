import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";

import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import "./Dashboard.css"; // Your custom styles


import swal from "sweetalert";
import useTitle from "../../../shared/hooks/useTitle";
import useBackButton from "../../../shared/hooks/useBack";
import JobCardTabs from "./JobCardTabs";
import AllocateJobCard from "../dialogs/AllocateJobCardModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import Dropdown from "../../../shared/components/dropdown/Dropdown";

import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import Modal from "../../../shared/components/Modal";
import JobCardDashboardGrids from "./JobCardDashboardGrids";
import JobCardReports from "../JobCardReports";
import CreateJobCardModal from "../dialogs/CreateJobCardModal";

const CompanyJobCard = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);


  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const onCreateJobCard = () => {
    showModalFromId(MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL);
  };

  const [selectedTab, setselectedTab] = useState("strategy-tab");
  useTitle("Job Card Dashboard");
  useBackButton();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.jobcard.jobcard.getAll();

        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.jobcard]);

  if (loading) return <LoadingEllipsis />;

  function handleExportPDF(): void {
    throw new Error("Function not implemented.");
  }

  function handleExportExcel(): void {
    throw new Error("Function not implemented.");
  }

  function handleFeedback(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ErrorBoundary>
      <div className="reports uk-section">
        <div className="uk-container uk-container-xlarge background white">
          <ErrorBoundary>
            <Toolbar
              leftControls={
                <JobCardTabs
                  selectedTab={selectedTab}
                  setselectedTab={setselectedTab}
                />
              }
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={onCreateJobCard}
                    // disabled={!isEditing}
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                    Create New
                  </button>
                  <div className="uk-inline">
                    <button
                      className="btn btn-primary"
                      title="More Job Card Actions.">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export your scorecard as PDF.">
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export PDF
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportExcel}
                          title="Export your scorecard as EXCEL.">
                          <FontAwesomeIcon
                            icon={faFileExcel}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Export Excel
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleFeedback}
                          title="Read Comments">
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            size="lg"
                            className="icon uk-margin-small-right"
                          />
                          Feedback
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            {!loading && selectedTab === "strategy-tab" && (
              <JobCardDashboardGrids />
            )}
            {!loading && selectedTab === "department-tab" && <JobCardReports />}
            {!loading && selectedTab === "people-tab" && <CreateJobCardModal />}
            {!loading && selectedTab === "execution-tab" && <AllocateJobCard />}
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.EXECUTION.CREATEJOBCARD_MODAL}>
        <CreateJobCardModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default CompanyJobCard;
