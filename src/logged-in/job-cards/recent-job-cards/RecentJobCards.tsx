import React, { useEffect, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";

interface IProps {
  jobcards: IJobCard[];
  onAcknowledge: (jobCard: IJobCard) => Promise<void>;
}

const DeductionSubmissionCard: React.FC<IProps> = ({
  jobcards,
  onAcknowledge,
}) => {
  const { api } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([api.jobcard.jobcard.getAll()]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    loadAll();
  }, [api.jobcard]);

  // Only display the recent 2 job cards
  const recentJobCards = jobcards.slice(0, 2);

  return (
    <ErrorBoundary>
      <div className="uk-grid uk-grid-small" data-uk-grid>
        {!loading &&
          recentJobCards.map((jobcard) => (
            <div className="uk-width-1-2" key={jobcard.id}>
              <div className="uk-card uk-card-default uk-card-small">
                <div className="uk-card-body">
                  <span>Description:</span>
                  <h4 className="main-title-small uk-margin-small-left">
                    {/* {jobcard.jobDescription} */}
                  </h4>
                  <button
                    className="btn btn-primary"
                    onClick={() => onAcknowledge(jobcard)}
                    disabled={jobcard.acknowledged} // Disable button if acknowledged is true
                  >
                    {jobcard.acknowledged ? "Acknowledged" : "Acknowledge"}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {loading && <LoadingEllipsis />}
    </ErrorBoundary>
  );
};

export default DeductionSubmissionCard;
