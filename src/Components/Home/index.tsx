import { useEffect } from "react";

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
import { useNxtwatchContext } from "../../Hocs/NxtwatchMachineWrapper";
import { useSelector } from "@xstate/react";

export const RenderHomeVideos = ({ state }: any) => {
  const { homeVideosArray, homeError } = state.context;

  if (state.matches({ home: "loading" })) {
    return <Loader />;
  }

  if (homeError) {
    return (
      <RenderFailure
        onRetry={() => state._session.send({ type: "FETCH_HOME" })}
      />
    );
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
};

const Home = () => {
  const {dashboardActor}=useNxtwatchContext();
  const dashboardState=useSelector(dashboardActor,(state:any)=>state)

  useEffect(() => {
    if (dashboardState.context.homeVideosArray.length === 0) {
      dashboardActor.send({ type: "FETCH_HOME" });
    }
  }, []);

  return (
    <PageWrapper>
      <Advertisement />
      <SearchWrapper>
        <SearchInput
          placeholder="Search"
          type="search"
          onChange={(e) => dashboardActor.send({ type: "SET_QUERY", value: e.target.value })}
        />
        <SearchButton data-testid="searchbtn" onClick={() => dashboardActor.send({ type: "FETCH_HOME" })}>
          <SearchIcon />
        </SearchButton>
      </SearchWrapper>
      <RenderHomeVideos state={dashboardState} />
    </PageWrapper>
  );
};
export default Home;
