import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";

import { useAppContext } from "../../../shared/functions/Context";
import EmptyError from "../../admin-settings/EmptyError";
import SectionItem from "./SectionItem";
import Section from "../../../shared/models/job-card-model/Section";


const SectionList = observer(() => {
  const { store } = useAppContext();

  const sortByName = (a: Section, b: Section) => {
    if (a.asJson.name < b.asJson.name) return -1;
    if (a.asJson.name > b.asJson.name) return 1;
    return 0;
  };

  return (
    <ErrorBoundary>
      <div className="department-list">
        <ErrorBoundary>
          {store.jobcard.section.all.sort(sortByName).map((department) => (
            <div key={department.asJson.id}>
              <SectionItem section={department.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {store.department.isEmpty && (
            <EmptyError errorMessage="No departments found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default SectionList;
