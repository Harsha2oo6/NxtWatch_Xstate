import { dashboardMachineConfig } from "./dashboardMachine";
import { createActor } from "xstate";

describe("dashboardMachine", () => {
  it("should initialize with correct default context", () => {
    const actor = createActor(dashboardMachineConfig);
    actor.start();
    expect(actor.getSnapshot().context).toMatchObject({
      searchQuery: "",
      homeVideosArray: [],
      trendingVideosArray: [],
      gamingVideosArray: [],
      savedVideosArray: [],
      videoDetails: null,
    });
  });

  it("should update searchQuery on SET_QUERY event", () => {
    const actor = createActor(dashboardMachineConfig);
    actor.start();
    actor.send({ type: "SET_QUERY", value: "react" });
    expect(actor.getSnapshot().context.searchQuery).toBe("react");
  });

  it("should add a video to savedVideosArray on ADD_SAVED event", () => {
    const actor = createActor(dashboardMachineConfig);
    actor.start();
    const video = { id: "1", title: "Test", description: "", video_url: "", view_count: "", published_at: "", channel: { name: "", profile_image_url: "", subscriber_count: "" } };
    actor.send({ type: "ADD_SAVED", details: video });
    expect(actor.getSnapshot().context.savedVideosArray).toContainEqual(video);
  });

  it("should remove a video from savedVideosArray on REMOVE_SAVED event", () => {
    const actor = createActor(dashboardMachineConfig);
    actor.start();
    const video = { id: "1", title: "Test", description: "", video_url: "", view_count: "", published_at: "", channel: { name: "", profile_image_url: "", subscriber_count: "" } };
    actor.send({ type: "ADD_SAVED", details: video });
    actor.send({ type: "REMOVE_SAVED", id: "1" });
    expect(actor.getSnapshot().context.savedVideosArray).not.toContainEqual(video);
  });

  // You can add more tests for state transitions and invoked services as needed.
});