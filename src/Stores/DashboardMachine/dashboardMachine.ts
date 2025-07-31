import { assign, createMachine, fromPromise } from "xstate";
import { FetchDetails } from "../../Services/FetchingServices";
import {
  GamingVideosApi,
  HomeVideosApi,
  TrendingVideosApi,
  VideoDetailsApi,
} from "../../Constants/Apis";

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
  | { type: "ADD_SAVED" ; details:any }
  | { type: "REMOVE_SAVED"; id: string };
export const dashboardMachineConfig = createMachine({
  id: "dasboardMachine",
  type: "parallel",
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
    ADD_SAVED:{
      actions: assign(({context,event})=>{
          return {savedVideosArray: [...context.savedVideosArray,event.details]}
      })
    },
    REMOVE_SAVED:{
      actions:assign(({context,event})=>{
        return {savedVideosArray: context.savedVideosArray.filter((each)=>each.id!== event.id)}
      })
    }
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
              return FetchDetails(`${HomeVideosApi}${input.searchQuery}`);
            }),
            input: ({ context }) => {
              return context;
            },
            onDone: {
              target: "idle",
              actions: assign({
                homeVideosArray: ({ event }) =>
                  (event.output as any).videos ?? [],
                homeError: () => "",
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
    trending: {
      initial: "idle",
      states: {
        idle: {
          on: {
            FETCH_TRENDING: "loading",
          },
        },
        loading: {
          invoke: {
            src: fromPromise(async () => {
              return FetchDetails(TrendingVideosApi);
            }),
            onDone: {
              target: "idle",
              actions: assign({
                trendingVideosArray: ({ event }) => {
                  return (event.output as any).videos ?? [];
                },
                trendingError: () => "",
              }),
            },
            onError: {
              target: "idle",
              actions: assign({ trendingError: () => "failed" }),
            },
          },
        },
      },
    },
    gaming: {
      initial: "idle",
      states: {
        idle: {
          on: {
            FETCH_GAMING: "loading",
          },
        },
        loading: {
          invoke: {
            src: fromPromise(async () => {
              return FetchDetails(GamingVideosApi);
            }),
            onDone: {
              target: "idle",
              actions: assign({
                gamingVideosArray: ({ event }) => {
                  return (event.output as any).videos ?? [];
                },
                gamingError: () => "",
              }),
            },
            onError: {
              target: "idle",
              actions: assign({ gamingError: () => "failed" }),
            },
          },
        },
      },
    },
    videoDetails: {
      initial: "idle",
      states: {
        idle: {
          on: {
            FETCH_DETAILS: "loading",
          },
        },
        loading: {
          invoke: {
            src: fromPromise(async ({ input }) => {
              return FetchDetails(`${VideoDetailsApi}${input.id}`);
            }),
            input: ({ event }) => {
              if (event.type === "FETCH_DETAILS") {
                return { id: event.id };
              }
            },
            onDone: {
              target: "idle",
              actions: assign({
                videoDetails: ({ event }) => {
                  console.log(event.output.video_details)
                  return (event.output as any).video_details ?? null;
                },
                videoDetailsError: () => "",
              }),
            },
            onError: {
              target: "idle",
              actions: assign({ videoDetailsError: () => "failed" }),
            },
          },
        },
      },
    },
  },
});
/** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgAoBbAQwGMALASwzAEp8QAHLWKgFyqw0YA9EAjACZ0AT0FDkU5EA */
