import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import BusinessUnit from "../../../shared/models/BusinessUnit";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import DivisionItem from "./DivisionItem";
import EmptyError from "../../admin-settings/EmptyError";
import { Division } from "../../../shared/models/job-card-model/Division";

const DivisionList = observer(() => {
  const { store } = useAppContext();

  const sortByName = (a: Division, b: Division) => {
    if (a.asJson.name < b.asJson.name) return -1;
    if (a.asJson.name > b.asJson.name) return 1;
    return 0;
  };

  return (
    <ErrorBoundary>
      <div className="business-unit-list">
        <ErrorBoundary>
          {store.jobcard.division.all.sort(sortByName).map((d) => (
            <div key={d.asJson.id}>
              <DivisionItem division={d.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {!store.jobcard.division.all.length && (
            <EmptyError errorMessage="No business units found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default DivisionList;
