import ReactPlayer from "react-player";
import { VideoplayerWrapper } from "./styledComponents";

const VideoPlayer = ({ url }: { url: string }) => {
  console.log(url);
  return <VideoplayerWrapper> <ReactPlayer src={url} controls width={"100%"} height={"100%"}/></VideoplayerWrapper>;
};

export default VideoPlayer;
