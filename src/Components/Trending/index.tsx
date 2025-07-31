import { useEffect } from "react";
import { PageWrapper } from "../Home/styledWrapper";
import RouteHeader from "../../Common/RouteHeader";
import TrendingVideoCard from "../TrendingVideoCard";
import { TrendingVideos } from "./styledComponents";
import Loader from "../../Common/Loader";
import RenderFailure from "../../Common/FailurePage";
import { useDashboardMachine } from "../../Hocs/DashboardMachineWrapper";
import { useNxtwatchContext } from "../../Hocs/NxtwatchMachineWrapper";
import { useSelector } from "@xstate/react";

export const RenderTrendingVideos = ({ state, send }: any) => {
  const { trendingError, trendingVideosArray } = state.context;
  if (state.matches({ trending: "loading" })) {
    return <Loader />;
  } else if (trendingError !== "") {
    return <RenderFailure onRetry={() => send({ type: "FETCH_TRENDING" })} />;
  } else {
    return (
      <>
        {trendingVideosArray.map((each: any) => (
          <TrendingVideoCard key={each.id} details={each} />
        ))}
      </>
    );
  }
};

const Trending = () => {
  // const { state, send } = useDashboardMachine();
  const {dashboardActor}=useNxtwatchContext();
  const dashboardState=useSelector(dashboardActor,(state:any)=>state)

  useEffect(() => {
    if (dashboardState.context.trendingVideosArray.length === 0) {
      dashboardActor.send({ type: "FETCH_TRENDING" });
    }
  }, []);

  return (
    <PageWrapper>
      <RouteHeader routeName={"Trending"} />
      <TrendingVideos>
        <RenderTrendingVideos state={dashboardState} send={dashboardActor.send} />
      </TrendingVideos>
    </PageWrapper>
  );
};

export default Trending;
