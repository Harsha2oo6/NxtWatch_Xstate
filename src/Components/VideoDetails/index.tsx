import { useEffect, useState } from "react";
import {
  VideoDescription,
  DescriptionTop,
  DescriptionDetails,
  DescriptionDate,
  DescriptionBottom,
  ProfileDes,
  ChannelProfile,
  Subscribers,
  ChannelDescription,
  LikeStatusButton,
  LikeDiv,
  VideoDes,
  VideoTitle,
} from "./styledComponents";
import { useParams } from "react-router-dom";
import VideoPlayer from "../../Services/VideoPlayer";
import { DislikeIcon, LikeIcon, SavedIcon } from "../../Common/Icons";
import { Para } from "../Footer/styledComponents";
import Loader from "../../Common/Loader";
import { DurationFinder } from "../../Services/DateFormating";
import { useDashboardMachine } from "../DashboardMachineWrapper";
import RenderFailure from "../../Common/FailurePage";

type LikeStatus = "liked" | "disliked" | "";

const checkSaved = (id: any, state: any) => {
  return state.context.savedVideosArray.some((each: any) => each.id === id);
};

const VideoDetails = () => {
  const { state, send } = useDashboardMachine();
  const { videoDetails, videoDetailsError } = state.context;
  const { id } = useParams();

  const [likeStatus, setLikeStatus] = useState<LikeStatus>("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      send({ type: "FETCH_DETAILS", id: id });
    }
  }, [id]);

  useEffect(() => {
    if (videoDetails?.id) {
      const saved = checkSaved(id, state);
      setIsSaved(saved);
    }
  }, [videoDetails]);

  if (!videoDetails) {
    return <Loader />;
  } else if (videoDetailsError !== "") {
    return (
      <RenderFailure onRetry={() => send({ type: "FETCH_DETAILS", id: id })} />
    );
  } else {
    const {
      video_url,
      title,
      description,
      published_at,
      view_count,
      channel: { name, profile_image_url, subscriber_count },
    } = videoDetails;

    const handleLike = () => {
      setLikeStatus((prev) => (prev === "liked" ? "" : "liked"));
    };

    const handleDislike = () => {
      setLikeStatus((prev) => (prev === "disliked" ? "" : "disliked"));
    };

    const handleSave = () => {
      if (!videoDetails?.id) return;

      if (checkSaved(id, state)) {
        send({ type: "REMOVE_SAVED", id: id });
        setIsSaved(false);
      } else {
        send({ type: "ADD_SAVED", details: videoDetails });
        setIsSaved(true);
      }
    };

    return (
      <VideoDescription>
        <VideoPlayer url={video_url} />
        <DescriptionTop>
          <VideoTitle>{title}</VideoTitle>
          <DescriptionDetails>
            <DescriptionDate>
              <Para>{view_count} Views</Para>
              <p>● {DurationFinder(published_at)}</p>
            </DescriptionDate>
            <DescriptionDate>
              <LikeStatusButton
                className={likeStatus === "liked" ? "liked" : ""}
                onClick={handleLike}
              >
                <LikeDiv>
                  <LikeIcon />
                  Like
                </LikeDiv>
              </LikeStatusButton>
              <LikeStatusButton
                className={likeStatus === "disliked" ? "liked" : ""}
                onClick={handleDislike}
              >
                <LikeDiv>
                  <DislikeIcon />
                  Dislike
                </LikeDiv>
              </LikeStatusButton>
              <LikeStatusButton
                className={isSaved ? "liked" : ""}
                onClick={handleSave}
              >
                <LikeDiv>
                  <SavedIcon />
                  {isSaved ? "Saved" : "Save"}
                </LikeDiv>
              </LikeStatusButton>
            </DescriptionDate>
          </DescriptionDetails>
        </DescriptionTop>
        <hr />
        <DescriptionBottom>
          <ChannelProfile src={profile_image_url} alt="profile" />
          <ProfileDes>
            <ChannelDescription>
              <VideoTitle>{name}</VideoTitle>
              <Subscribers>{subscriber_count} Subscribers</Subscribers>
            </ChannelDescription>
            <VideoDes>{description}</VideoDes>
          </ProfileDes>
        </DescriptionBottom>
      </VideoDescription>
    );
  }
};

export default VideoDetails;
