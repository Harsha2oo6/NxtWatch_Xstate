import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NxtwatchContext } from "../Hocs/NxtwatchMachineWrapper";
import SavedVideos from "../Components/SavedVideos";

// Helper: Create a mock XState actor with the required interface
function createMockActor(state: any) {
  return {
    getSnapshot: () => state,
    send: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
  };
}

// Helper: Render SavedVideos with a mocked dashboardActor in context
function renderWithMockContext(dashboardState: any) {
  const mockDashboardActor = createMockActor(dashboardState);
  return render(
    <NxtwatchContext.Provider
      value={{
        themeActor: {},
        loginActor: {},
        dashboardActor: mockDashboardActor,
        isDark: false,
      }}
    >
      <MemoryRouter>
        <SavedVideos />
      </MemoryRouter>
    </NxtwatchContext.Provider>
  );
}

describe("SavedVideos Integration (with mocked XState context)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render saved videos list when array is populated", () => {
    const state = {
      matches: () => false,
      context: {
        savedVideosArray: [
          {
            id: "1",
            title: "Saved Video 1",
            thumbnail_url: "",
            view_count: "",
            published_at: "2 NOV 2006",
            channel: { name: "Channel 1", profile_image_url: "" },
          },
          {
            id: "2",
            title: "Saved Video 2",
            thumbnail_url: "",
            view_count: "",
            published_at: "3 NOV 2006",
            channel: { name: "Channel 2", profile_image_url: "" },
          },
        ],
      },
    };
    renderWithMockContext(state);
    expect(screen.getByText("Saved Video 1")).toBeInTheDocument();
    expect(screen.getByText("Saved Video 2")).toBeInTheDocument();
  });

  it("should display correct route header name", () => {
    const state = {
      matches: () => false,
      context: { savedVideosArray: [] },
    };
    renderWithMockContext(state);
    expect(screen.getByText("Saved Videos")).toBeInTheDocument();
  });

  it("should render trending video cards for each saved video", () => {
    const state = {
      matches: () => false,
      context: {
        savedVideosArray: [
          {
            id: "1",
            title: "Card Video 1",
            thumbnail_url: "",
            view_count: "",
            published_at: "2 NOV 2006",
            channel: { name: "Channel 1", profile_image_url: "" },
          },
          {
            id: "2",
            title: "Card Video 2",
            thumbnail_url: "",
            view_count: "",
            published_at: "3 NOV 2006",
            channel: { name: "Channel 2", profile_image_url: "" },
          },
        ],
      },
    };
    renderWithMockContext(state);
    expect(screen.getByText("Card Video 1")).toBeInTheDocument();
    expect(screen.getByText("Card Video 2")).toBeInTheDocument();
  });

  it("should display 'No Saved Videos' when array is empty", () => {
    const state = {
      matches: () => false,
      context: { savedVideosArray: [] },
    };
    renderWithMockContext(state);
    expect(screen.getByText(/No Saved Videos/i)).toBeInTheDocument();
  });

  it("should handle undefined savedVideosArray gracefully", () => {
    const state = {
      matches: () => false,
      context: {},
    };
    renderWithMockContext(state);
    expect(screen.getByText(/No Saved Videos/i)).toBeInTheDocument();
  });

  it("should render safely when dashboardActor is null or context is undefined", () => {
    // Case 1: dashboardActor is null
    render(
      <NxtwatchContext.Provider
        value={{
          themeActor: {},
          loginActor: {},
          dashboardActor: null,
          isDark: false,
        }}
      >
        <MemoryRouter>
          <SavedVideos />
        </MemoryRouter>
      </NxtwatchContext.Provider>
    );
    expect(screen.getByText("Saved Videos")).toBeInTheDocument();

    // Case 2: useNxtwatchContext returns undefined
    render(
      <NxtwatchContext.Provider value={undefined as any}>
        <MemoryRouter>
          <SavedVideos />
        </MemoryRouter>
      </NxtwatchContext.Provider>
    );
    expect(screen.getByText("Saved Videos")).toBeInTheDocument();
  });
});