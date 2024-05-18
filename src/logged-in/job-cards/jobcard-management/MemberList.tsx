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


const MemberList = observer(() => {
  const { store } = useAppContext();
  const [search, setSearch] = useState("");

  const sortByName = (a: Member, b: Member) => {
    if ((a.asJson.name || "") < (b.asJson.name || "")) return -1;
    if ((a.asJson.name || "") > (b.asJson.name || "")) return 1;
    return 0;
  };

  const me = store.auth.meJson;

  const members = useMemo(() => {
    const _clients =
      (me &&
        store.jobcard.member.all.filter(($users) => {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
            return $users;
          else return !$users.asJson.name;
        })) ||
      [];

    return search !== ""
      ? _clients.filter((u) => u.asJson.id === search)
      : _clients;
  }, [me, search, store.jobcard.member.all]);

  const options: IOption[] = useMemo(
    () =>
      members.map((members) => {
        return { label: members.asJson.name || "", value: members.asJson.id };
      }),
    [members]
  );

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
      <div className="users-list">
        <ErrorBoundary>
          {members.sort(sortByName).map((members) => (
            <div key={members.asJson.id}>
              <MemberItem member={members.asJson} />
            </div>
          ))}
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
