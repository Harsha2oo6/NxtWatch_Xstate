import { useEffect } from "react";
import RouteHeader from "../../Common/RouteHeader";
import { PageWrapper } from "../Home/styledWrapper";
import GamingView from "../GamingVideoCard";
import Loader from "../../Common/Loader";
import RenderFailure from "../../Common/FailurePage";
import { GamingVideos } from "./styledComponents";
import { useDashboardMachine } from "../DashboardMachineWrapper";
import { RenderNoVideosView } from "../../Common/NoVideosFound";

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
  const { state, send } = useDashboardMachine();
  useEffect(() => {
    if (state.context.gamingVideosArray.length === 0) {
      send({ type: "FETCH_GAMING" });
    }
  }, []);

  return (
    <PageWrapper>
      <RouteHeader routeName="Gaming" />
      <GamingVideos>
        <RenderGamingVideos state={state} send={send} />
      </GamingVideos>
    </PageWrapper>
  );
};

export default Gaming;
