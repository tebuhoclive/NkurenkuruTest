import {
  faFilePdf,
  faFileExcel,
  faCheck,
  faPaperPlane,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import showModalFromId from "../../shared/functions/ModalShow";
import { ALL_TAB, fullPerspectiveName, MAP_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureCompany from "../../shared/models/MeasureCompany";
import ObjectiveCompany from "../../shared/models/ObjectiveCompany";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IScorecardReview } from "../../shared/models/ScorecardReview";
import EmptyError from "../admin-settings/EmptyError";
import MeasureCompanyUpdateQ2ActualModal from "../dialogs/measure-company-update-q2-actual/MeasureCompanyUpdateQ2ActualModal";
import MeasureCompanyModal from "../dialogs/measure-company/MeasureCompanyModal";
import MeasureStatusUpdateCompanyModal from "../dialogs/measure-status-update-company/MeasureStatusUpdateCompanyModal";
import MODAL_NAMES from "../dialogs/ModalName";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor } from "../shared/functions/Scorecard";
import { sortByPerspective } from "../shared/utils/utils";
import NoMeasures from "./NoMeasures";
import StrategicMap from "./strategic-map/CompanyStrategicMap";

interface IMoreButtonProps {
  agreement: IScorecardMetadata;
}
const MoreButton = observer((props: IMoreButtonProps) => {
  const { agreement } = props;
  const { api, ui, store } = useAppContext();

  const me = store.auth.meJson; // TODO: issue!
  const objectives = store.companyObjective.all;
  const measures = store.companyMeasure.all;
  const measureAudits = store.companyMeasureAudit.all;
  const reviewApi = api.companyScorecardReview.quarter1;
  const scorecard = store.scorecard.active;

  const status = useMemo(
    () => agreement.quarter2Review.status || "pending",
    [agreement.quarter2Review.status]
  );

  const isDisabled = useMemo(
    () => !scorecard || scorecard.midtermReview.status !== "in-progress",
    [scorecard]
  );

  const onSubmitReview = async () => {
    if (!me) return;
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $review = reviewApi.transform(
      me,
      _objectives,
      _measures,
      _measureAudits
    );
    const $agreement = agreement;
    $agreement.quarter2Review.status = "submitted";
    $agreement.quarter2Review.submittedOn = new Date().toDateString();

    await onUpdate($agreement, $review);
  };

  const onUpdate = async (
    agreement: IScorecardMetadata,
    review: IScorecardReview
  ) => {
    try {
      await reviewApi.create(review);
      await api.companyScorecardMetadata.create(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Submitted Q2 progress for review.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to submit your Q2 progress for review.",
        type: "danger",
      });
    }
  };

  return (
    <ErrorBoundary>
      {status === "in-progress" && (
        <button
          className="kit-dropdown-btn"
          onClick={onSubmitReview}
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon uk-margin-small-right"
          />
          Submit Q2 Progress for Review
        </button>
      )}
      {status === "submitted" && (
        <button className="kit-dropdown-btn" disabled>
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          Submitted Q2 Progress for Review
        </button>
      )}
      {status === "approved" && (
        <button className="kit-dropdown-btn">
          <FontAwesomeIcon
            icon={faCheck}
            className="icon icon--success uk-margin-small-right"
          />
          View Q2 Performance
        </button>
      )}
    </ErrorBoundary>
  );
});



interface IMeasureTableItemProps {
  measure: MeasureCompany;
  canUpdate: boolean;
  isApproved: boolean;
}
const MeasureTableItem = (props: IMeasureTableItemProps) => {
  const { store } = useAppContext();
  const { canUpdate, isApproved } = props;

  const measure = props.measure.asJson;

  const rateCss = rateColor(
    Number(measure.q2Rating) || measure.q2AutoRating,
    measure.isUpdated
  );

  const handleEditComments = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MEASURE_COMMENTS_MODAL);
  };

  const handleUpdateMeasureProgress = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    store.companyMeasure.select(measure); // select measure
    showModalFromId(
      MODAL_NAMES.EXECUTION.COMPANY_MEASURE_UPDATE_Q2_ACTUAL_MODAL
    );
  };

  return (
    <tr className="row">
      <td>
        <div className={`status ${rateCss}`}></div>
      </td>
      <td>
        {measure.description}
        <button
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: commenting; ratio: 1"
        ></button>
      </td>

      <td className="no-whitespace">
        {dataFormat(measure.dataType, measure.baseline, measure.dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(measure.dataType, measure.annualTarget, measure.dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter1Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter2Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter3Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter4Target,
          measure.dataSymbol
        )}
      </td>
      <td className="no-whitespace">
        {dataFormat(
          measure.dataType,
          measure.quarter2Actual,
          measure.dataSymbol
        )}
      </td>
      <td className={`no-whitespace actual-value ${rateCss}`}>
        {measure.q2AutoRating}
      </td>
      {canUpdate && (
        <td>
          <div className="controls">
            <button className="btn-icon" onClick={handleUpdateMeasureProgress}>
            <span data-uk-icon="pencil"></span>
            </button>
          </div>
        </td>
      )}
      {isApproved && (
        <td className={`no-whitespace actual-value ${rateCss}`}>
          {measure.q2Rating || measure.q2AutoRating || "-"}
        </td>
      )}
    </tr>
  );
};

interface IMeasureTableProps {
  measures: MeasureCompany[];
  agreement: IScorecardMetadata;
}
const MeasureTable = (props: IMeasureTableProps) => {
  const { measures, agreement } = props;
  const { store } = useAppContext();

  const role = store.auth.role;

  const isApproved = useMemo(
    () => agreement.quarter2Review.status === "approved",
    [agreement]
  );

  const canUpdate = useMemo(() => {
    const statusCondition =
      agreement.quarter2Review.status === "in-progress" ||
      agreement.quarter2Review.status === "pending";
    const roleCondition =
      role === USER_ROLES.SUPER_USER || role === USER_ROLES.MD_USER;

    return statusCondition && roleCondition;
  }, [agreement.quarter2Review.status, role]);

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th></th>
              <th className="uk-width-expand@s">Measure/KPI</th>
              <th>Baseline</th>
              <th>Annual Target</th>
              <th>Q1 Target</th>
              <th>Q2 Target</th>
              <th>Q3 Target</th>
              <th>Q4 Target</th>
              <th>Progress</th>
              <th>Q2 E-Rating</th>
              {canUpdate && <th></th>}
              {isApproved && <th>Q2 S-Rating</th>}
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <MeasureTableItem
                key={measure.asJson.id}
                measure={measure}
                canUpdate={canUpdate}
                isApproved={isApproved}
              />
            ))}
          </tbody>
        </table>
      )}

      {measures.length === 0 && <NoMeasures />}
    </div>
  );
};

interface IObjectiveItemProps {
  objective: ObjectiveCompany;
  children?: React.ReactNode;
 
  measures: MeasureCompany[];
  agreement: IScorecardMetadata;

}
const ObjectiveItem = (props: IObjectiveItemProps) => {
  const { children, objective,measures, } = props;

  const getOverall = (): number => {
    if (measures.length > 0) {
      const overall = measures.reduce(
        (total, measure) => total + (measure.asJson.q2AutoRating || 0),
        0
      );
      const averageRating = overall / measures.length;
      return parseFloat(averageRating.toFixed(2)); // Convert back to number
    } else {
      return 0; // Return 0 or any default value if measures is empty
    }
  };
  
  const rating =getOverall()
  const { description, perspective, weight } = objective.asJson;
  const { rate, isUpdated } = objective.q2Rating;

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <div className="uk-margin-right">
          <Rating rate={rating} isUpdated={isUpdated} />
        </div>
        <h3 className="objective-name uk-width-1-1">
          {description}
          <span className="objective-persepctive uk-margin-small-left">
            {fullPerspectiveName(perspective)}
          </span>
          <span className="objective-weight">Weight: {weight || 0}%</span>
        </h3>
      </div>

      <div className="uk-margin">{children}</div>
    </div>
  );
};

interface IStrategicListProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveCompany[];
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { agreement, objectives } = props;

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ErrorBoundary key={objective.asJson.id}>
          <ObjectiveItem  objective={objective} measures={objective.measures} agreement={agreement}>
            <MeasureTable measures={objective.measures} agreement={agreement} />
          </ObjectiveItem>
        </ErrorBoundary>
      ))}

      {!objectives.length && <EmptyError errorMessage="No objective found" />}
    </div>
  );
});

interface IProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveCompany[];
  hasAccess: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  handleFeedback: () => void;
}
const CompanyScorecardQCycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
    handleFeedback
  } = props;

  const [tab, setTab] = useState(ALL_TAB.id);
  const { api, ui, store } = useAppContext();
  const measures = store.companyMeasure.all;
  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);
  const getOverall = (): number => {
    if (measures.length > 0) {
      const overall = measures.reduce(
        (total, measure) => total + (measure.asJson.q2AutoRating || 0),
        0
      );
      const averageRating = overall / measures.length;
      return parseFloat(averageRating.toFixed(2)); // Convert back to number
    } else {
      return 0; // Return 0 or any default value if measures is empty
    }
  };
  
  const rating =getOverall()
  
  if (agreement.quarter1Review.status !== "approved")
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="Company Q1 performance is not approved."
          subtitle="You cannot view Quarter 2 tab if the Quarter 1 results has not yet been approved."
          instruction="Please ensure that the Quarter 1 results is approved/reviewed."
        />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="company-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      {hasAccess && (
                        <li>
                          <ErrorBoundary>
                            <MoreButton agreement={agreement} />
                          </ErrorBoundary>
                        </li>
                      )}
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleExportPDF}
                          title="Export your scorecard as PDF."
                        >
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
                          title="Export your scorecard as EXCEL."
                        >
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
                          title="Read Comments"
                        >
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
          <ErrorBoundary>
            <Toolbar
            
              leftControls={
                <ErrorBoundary>

           <h6 className="uk-title">OVERALL RATING: {rating}</h6>
                   
           
                 
                    
    
                
                </ErrorBoundary>
              }
              rightControls={
                <ErrorBoundary>
                
            
                  <div className="uk-inline"> 
                  </div>
                
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            {tab === MAP_TAB.id && <StrategicMap />}
            {tab !== MAP_TAB.id && (
              <StrategicList
                agreement={agreement}
                objectives={filteredObjectivesByPerspective}
              />
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_MODAL}>
          <MeasureCompanyModal />
        </Modal>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_UPDATE_Q2_ACTUAL_MODAL}
        >
          <MeasureCompanyUpdateQ2ActualModal />
        </Modal>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.COMPANY_MEASURE_STATUS_UPDATE_MODAL}
        >
          <MeasureStatusUpdateCompanyModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardQCycle;
