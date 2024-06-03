import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import SingleSelect, { IOption } from "../../../shared/components/single-select/SingleSelect";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import ClientAccountItem from "./ClientAccountItem";
import EmptyError from "../../admin-settings/EmptyError";
import { useAppContext } from "../../../shared/functions/Context";
import Member from "../../../shared/models/job-card-model/Members";
import MemberItem from "./MemberItem";
import TeamMember, { ITeamMember } from "../../../shared/models/job-card-model/TeamMember";
import TeamMemberJobCardTable from "./grids/TeamMemberJobCardTable";
import MODAL_NAMES from "../../dialogs/ModalName";
import showModalFromId from "../../../shared/functions/ModalShow";


const MemberList = observer(() => {
  const { store } = useAppContext();
  const [search, setSearch] = useState("");

  const sortByName = (a: TeamMember, b: TeamMember) => {
    if ((a.asJson.name || "") < (b.asJson.name || "")) return -1;
    if ((a.asJson.name || "") > (b.asJson.name || "")) return 1;
    return 0;
  };

  const me = store.auth.meJson;

  const teamMember = store.jobcard.teamMember.all;

  const teamMemberList = store.jobcard.teamMember.all
    .map((teamMember) => teamMember.asJson)
   
  //stats
  const options: IOption[] = useMemo(
    () =>
      teamMember.map((members) => {
        return { label: members.asJson.name || "", value: members.asJson.id };
      }),
    [teamMember]
  );
  const onViewCreated = (selectedJobCard: ITeamMember) => {
    console.log("selected job card", selectedJobCard);
    // store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };
  const onView = (selectedJobCard: ITeamMember) => {
    console.log("selected job card", selectedJobCard);
    // store.jobcard.jobcard.select(selectedJobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };

  const onSearch = (value: string) => setSearch(value);

  return (
    <ErrorBoundary>
      <Toolbar
        rightControls={
          <ErrorBoundary>
            <SingleSelect
              name="search-team"
              options={options}
              width="250px"
              onChange={onSearch}
            />
          </ErrorBoundary>
        }
      />
      <div className="">
        <ErrorBoundary>
          {/* {teamMember.sort(sortByName).map((members) => (
            <div key={members.asJson.id}>
              <MemberItem teamMember={members.asJson} />
            </div>
          ))} */}
         
        </ErrorBoundary>
        <ErrorBoundary>
          {!store.user.all.length && (
            <EmptyError errorMessage="No users found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default MemberList;
