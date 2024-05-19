import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const SectionJobCardStats = ({ sections, jobCards }) => {
  // Filter sections that have job cards
  const sectionsWithJobCards = sections.filter((section) =>
    jobCards.some((jobCard) => jobCard.section === section.id)
  );

  return (
    <div className="uk-container uk-margin-top">
      <h2 className="uk-heading-bullet">Section Job Card Stats</h2>
      <table className="uk-table uk-table-divider uk-table-striped">
        <thead>
          <tr>
            <th>Section</th>
            <th>Total Job Cards</th>
            <th>Completed</th>
            <th>In Progress</th>
            <th>Overdue</th>
          </tr>
        </thead>
        <tbody>
          {sectionsWithJobCards.map((section) => {
            // Filter job cards for the current section
            const sectionJobCards = jobCards.filter(
              (jobCard) => jobCard.section === section.id
            );

            // Calculate counts for different statuses
            const completedCount = sectionJobCards.filter(
              (jobCard) => jobCard.status === "Completed"
            ).length;
            const inProgressCount = sectionJobCards.filter(
              (jobCard) => jobCard.status === "In Progress"
            ).length;
            const overdueCount = sectionJobCards.filter(
              (jobCard) =>
                new Date(jobCard.dueDate) < new Date() &&
                jobCard.status !== "Completed"
            ).length;

            return (
              <tr key={section.id}>
                <td>{section.name}</td>
                <td>{sectionJobCards.length}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="uk-margin-small-right"
                  />
                  {completedCount}
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faClock}
                    className="uk-margin-small-right"
                  />
                  {inProgressCount}
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="uk-margin-small-right"
                  />
                  {overdueCount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SectionJobCardStats;
