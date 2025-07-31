import { useEffect } from "react";
import RouteHeader from "../../Common/RouteHeader";
import { PageWrapper } from "../Home/styledWrapper";
import GamingView from "../GamingVideoCard";
import Loader from "../../Common/Loader";
import RenderFailure from "../../Common/FailurePage";
import { GamingVideos } from "./styledComponents";
import { useDashboardMachine } from "../../Hocs/DashboardMachineWrapper";
import { RenderNoVideosView } from "../../Common/NoVideosFound";
import { useNxtwatchContext } from "../../Hocs/NxtwatchMachineWrapper";
import { useSelector } from "@xstate/react";

export const RenderGamingVideos = ({ state, send }: any) => {
  const { gamingError, gamingVideosArray } = state.context;
  if (state.matches({ gaming: "loading" })) {
    return <Loader />;
  } else if (gamingError !== "") {
    return <RenderFailure onRetry={() => send({ type: "FETCH_GAMING" })} />;
  } else if (gamingVideosArray.length === 0) {
    return <RenderNoVideosView />;
  } else {
    return (
      <>
        {gamingVideosArray.map((each: any) => (
          <GamingView key={each.id} details={each} />
        ))}
      </>
    );
  }
};

const Gaming = () => {
  // const { state, send } = useDashboardMachine();
    const {dashboardActor}=useNxtwatchContext();
    const dashboardState=useSelector(dashboardActor,(state:any)=>state)
  useEffect(() => {
    if (dashboardState.context.gamingVideosArray.length === 0) {
      dashboardActor.send({ type: "FETCH_GAMING" });
    }
  }, []);

  return (
    <PageWrapper>
      <RouteHeader routeName="Gaming" />
      <GamingVideos>
        <RenderGamingVideos state={dashboardState} send={dashboardActor.send} />
      </GamingVideos>
    </PageWrapper>
  );
};

export default Gaming;
