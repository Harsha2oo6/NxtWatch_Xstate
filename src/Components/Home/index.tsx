import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import Advertisement from "../Advertisement";
import HomeVideoCard from "../HomeVideoCard";
import { SearchIcon } from "../../Common/Icons";

import {
  HomeVideos,
  PageWrapper,
  SearchButton,
  SearchInput,
  SearchWrapper,
} from "./styledWrapper";
import Loader from "../../Common/Loader";
import { RenderNoVideosView } from "../../Common/NoVideosFound";
import RenderFailure from "../../Common/FailurePage";
import { useDashboardMachine } from "../DashboardMachineWrapper";

export const RenderHomeVideos = observer(({ state }:any) => {
  const { homeVideosArray, homeError } = state.context;

  if (state.matches({ home: "loading" })) {
    return <Loader />;
  }

  if (homeError) {
    return <RenderFailure onRetry={() => state._session.send({ type: "FETCH_HOME" })} />;
  }

  if (homeVideosArray.length === 0) {
    return <RenderNoVideosView />;
  }

  return (
    <HomeVideos>
      {homeVideosArray.map((each: any) => (
        <HomeVideoCard key={each.id} details={each} />
      ))}
    </HomeVideos>
  );
});


const Home = observer(() => {
  const { state, send } = useDashboardMachine();

  useEffect(() => {
    if (state.context.homeVideosArray.length === 0) {
      send({ type: "FETCH_HOME" });
    }
  }, []);

  return (
    <PageWrapper>
      <Advertisement />
      <SearchWrapper>
        <SearchInput
          placeholder="Search"
          type="search"
          onChange={(e) => send({ type: "SET_QUERY", value: e.target.value })}
        />
        <SearchButton onClick={() => send({ type: "FETCH_HOME" })}>
          <SearchIcon />
        </SearchButton>
      </SearchWrapper>
      <RenderHomeVideos state={state} />
    </PageWrapper>
  );
});
export default Home