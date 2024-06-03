import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import SingleSelect, { IOption } from "../../../shared/components/single-select/SingleSelect";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../shared/components/toolbar/Toolbar";

import EmptyError from "../../admin-settings/EmptyError";
import { useAppContext } from "../../../shared/functions/Context";
import User from "../../../shared/models/User";
import Client from "../../../shared/models/job-card-model/Client";
import ClientAccountItem from "./ClientAccountItem";


const ClientAccountDetailsList = observer(() => {
  const { store } = useAppContext();
  const [search, setSearch] = useState("");

  const sortByName = (a: Client, b: Client) => {
    if ((a.asJson.name || "") < (b.asJson.name || "")) return -1;
    if ((a.asJson.name || "") > (b.asJson.name || "")) return 1;
    return 0;
  };

  const me = store.auth.meJson;
const clients=store.jobcard.client.all
 
  const options: IOption[] = useMemo(
    () =>
      clients.map((client) => {
        return { label: client.asJson.name || "", value: client.asJson.id};
      }),
    [clients]
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
          {clients.sort(sortByName).map((client) => (
            <div key={client.asJson.id}>
              <ClientAccountItem client={client.asJson} />
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

export default ClientAccountDetailsList;
