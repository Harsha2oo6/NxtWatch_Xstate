import { assign, createMachine, fromPromise } from "xstate";
import { FetchDetails } from "../../Services/FetchingServices";
import { HomeVideosApi } from "../../Constants/Apis";

export type Channel = {
  name: string;
  profile_image_url: string;
};

export type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  view_count: string;
  published_at: string;
  channel: Channel;
};

export type VideoDetails = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  view_count: string;
  published_at: string;
  channel: Channel & {
    subscriber_count: string;
  };
};

export type DashboardContext = {
  searchQuery: string;

  homeVideosArray: Video[];
  trendingVideosArray: Video[];
  gamingVideosArray: Video[];
  savedVideosArray: VideoDetails[];

  videoDetails: VideoDetails | null;

  homeError?: string;
  trendingError?: string;
  gamingError?: string;
  videoDetailsError?: string;
};
type DashboardEvent =
  | { type: "FETCH_HOME" }
  | { type: "FETCH_TRENDING" }
  | { type: "FETCH_GAMING" }
  | { type: "FETCH_DETAILS"; id: string }
  | { type: "SET_QUERY"; value: string }
  | { type: "ADD_SAVED" }
  | { type: "REMOVE_SAVED"; id: string };
export const dashboardMachineConfig = createMachine({
  id: "dasboardMachine",
  type:'parallel',
  context: {
    searchQuery: "",
    homeVideosArray: [],
    trendingVideosArray: [],
    gamingVideosArray: [],
    savedVideosArray: [],
    videoDetails: null,
  } as DashboardContext,

  types: {} as {
    context: DashboardContext;
    events: DashboardEvent;
  },
  on: {
    SET_QUERY: {
      actions: assign(({ event }) => {
        return { searchQuery: event.value };
      }),
    },
  },
  states: {
    home: {
      initial: "idle",
      states: {
        idle: {
          on: {
            FETCH_HOME: "loading",
          },
        },
        loading: {
          invoke: {
            src: fromPromise(async ({ input }: { input: DashboardContext }) => {
              console.log({ input }, "context in logging api call");
              return FetchDetails(`${HomeVideosApi}${input.searchQuery}`);
            }),
            input: ({ context }) => {
              console.log({ context }, "context in input");
              return context;
            },
            onDone: {
              target: "idle",
              actions: assign({
                homeVideosArray: ({ event }) =>
                  (event.output as any).videos ?? [],
              }),
            },
            onError: {
              target: "idle",
              actions: assign({ homeError: () => "failed" }),
            },
          },
        },
      },
    },
  },
});
/** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgAoBbAQwGMALASwzAEp8QAHLWKgFyqw0YA9EAjACZ0AT0FDkU5EA */
