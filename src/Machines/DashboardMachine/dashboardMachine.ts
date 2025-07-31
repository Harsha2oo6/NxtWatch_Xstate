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
  | { type: "ADD_SAVED"; details: any }
  | { type: "REMOVE_SAVED"; id: string };
export const dashboardMachineConfig = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQIawEYHsUCcIFkUBjACwEsA7MAYgGUBRAFQH0BFAVXoCUBNAbQAMAXUSgADplhkALmUwVRIAB6IAzACYA7ADoBANnUBWADQgAnonUDV2gJz6jAX0enUGbHkKlKNAIIARf2ZaXwA1en9BESQQCSlZeUUVBA1DbUNVewMTc0QARgEdWwy8pxcQNyxcAmJyKmouenwAeXDgsIioxTiZOQUY5NUBW21NWz0ADk0ciwRS51c0Ks9an20STABbMG0yCAAbGgAxJgBhAAlmc+b8ei6YnoT+0GSAFlUbd+nTWYnVPVGekM2QWFSWHhq3io6y2O322AglCg1Ag8h2lAAbpgANY7SoQrx1HYbbbaeEoREUKAITGYIgoJ5Re7iSS9RIDSzA3TZH6IWwTATadR5KaGUH46qEtYkuEIpHUMA4HCYHDaMT7BkAMxVm20EpWUOJsLJcqpNIoWPpjOEzNirKeSU5AIcM0QEymQqBIPK+shRO00hwYAolKguwOxzOl0YjQAcv4AJKxgDitsefUdCFeAnU2leEy+rrmItzek0Ium4vBktW0MDwdDJop8tR0NpuL11YN-vrIaRTdD5stDL6TOE3XtGY5CCMzp5uTmGgBpTFPq7frWvcb5NDCqVKrVGuk2pwut9UrrQb7VIHSKHdJH8jH0RZ8SnLyd3KMvLm6g+2jyctRSrdwa0NbQoBQTZ+z2Q5qBORgLmYZNfHwJNU3HB5J3ZD8s0A9JVBXH9XnsbQJkMWxVErNdQO7NZIOgm8dxbNFdgtHE8XXC8dgY-tmLNWkrVHG1MNfNlnmUT8XR-PRVFebRCLKRZaI3aFeKY01kUVZVVXVLUdU7FTuIgqC+M0+8hKfESXztN8cMkmcuWkhdDFePIFIoqjV2U5ZVJ2DE9jATB-DAaQUDIfZYHDOCEKQ-wmF8BMABlaDTbCJLefDAIrIs8kMdQJnSTQJhXEDfOMgKICCkKwoiqL+ORVt0XYjtz1rfzAuC0Lwsi28BPYyyKGfCc7IyqT51mPIy1zaxSpo8r2u0Srqu6uq+q0-ddKPE8zy4xblq62reoaizHyG6yRvEzNZy-XLDDGXRirmnyCXa6h6AxYNpAAAleNLRszCZhQA4Y3IK2xXjc-kfwKbM7GFcjJjckjbGccoKEwKr4BiNrDUuh1pwAWjyWwf3USYyM81QJkmdRbH5Kayte8CZXx98HLpn9NBIz1gQENzgWBCYmbA-0ZWisA2fs5IKJGApKO+BdbDydySOFTR1HUMH5ZFujoXFhqpbGhBNE0H9ijSIHZqUsEjMWrckSN67SYXeW0myyi6cMAQBDyQjdb8gMr0bWDJawgHp1lkGFdyowdEyAtNa10oVYD4yHY05sqSd6dTZhoZ3I1r0bdx-11KgHPcM5hdsxsVRPNcvKvQFVQ08W8uJcrhyo-lryf0F9JyJjtvwI7w3w6u3OzYXPRhjsPJs29F7RbWA6ap67GxIJquXcmyH3MKAUjH+RSCpH-019W3rQ67mX6ejvvXdnuv+cmajl71jqqsOjf1tvxA85P1eDoWSBU5rOCAA */
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
  entry: assign(() => {
    const saved = localStorage.getItem("saved_videos");
    return {
      savedVideosArray: saved ? JSON.parse(saved) : [],
    };
  }),
  on: {
    SET_QUERY: {
      actions: assign(({ event }) => {
        return { searchQuery: event.value };
      }),
    },

    ADD_SAVED: {
      actions: assign(({ context, event }) => {
        const updated = [...context.savedVideosArray, event.details];
        localStorage.setItem("saved_videos", JSON.stringify(updated));
        return { savedVideosArray: updated };
      }),
    },

    REMOVE_SAVED: {
      actions: assign(({ context, event }) => {
        const updated = context.savedVideosArray.filter(
          (each) => each.id !== event.id
        );
        localStorage.setItem("saved_videos", JSON.stringify(updated));
        return { savedVideosArray: updated };
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
                  console.log(event.output.video_details);
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
