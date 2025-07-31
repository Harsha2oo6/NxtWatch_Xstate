import NoSavedVideos from "../../Common/NoSavedVideos";
import RouteHeader from "../../Common/RouteHeader";
import { useDashboardMachine } from "../DashboardMachineWrapper";
import { PageWrapper } from "../Home/styledWrapper";
import { TrendingVideos } from "../Trending/styledComponents";
import TrendingVideoCard from "../TrendingVideoCard";

export const RenderSavedVideos = ({ videos }: any) => {
  if (videos.length === 0) {
    return <NoSavedVideos />;
  }

  return (
    <>
      {videos.map((each: any) => (
        <TrendingVideoCard key={each.id} details={each} />
      ))}
    </>
  );
};
const SavedVideos = () => {
  const { state } = useDashboardMachine();
  return (
    <PageWrapper>
      <RouteHeader routeName={"Saved Videos"} />
      <TrendingVideos>
        <RenderSavedVideos videos={state.context.savedVideosArray} />
      </TrendingVideos>
    </PageWrapper>
  );
};
export default SavedVideos;
