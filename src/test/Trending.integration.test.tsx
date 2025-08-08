import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Trending from "../Components/Trending";
import { NxtwatchContext } from "../Hocs/NxtwatchMachineWrapper";
import type { ReactNode } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Helper to create a mock actor for XState context
function createMockActor(state: any) {
  return {
    getSnapshot: () => state,
    send: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
  };
}

// Helper to render with mocked context
function renderWithMockContext(dashboardState: any, children: ReactNode) {
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
      {children}
    </NxtwatchContext.Provider>
  );
}

describe("Trending Integration (with mocked XState context)", () => {
  it("shows loader when loading", () => {
    const state = {
      matches: (s: any) => s.trending === "loading",
      context: { trendingVideosArray: [], trendingError: "" },
    };
    renderWithMockContext(state, <Trending />);
    // Loader should have a test id or text for assertion
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it("shows error when trendingError is set", () => {
    const state = {
      matches: () => false,
      context: { trendingVideosArray: [], trendingError: "failed" },
    };
    renderWithMockContext(state, <Trending />);
    expect(screen.getByTestId("failurepage")).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it("shows videos when trendingVideosArray is populated", () => {
    const state = {
      matches: () => false,
      context: {
        trendingVideosArray: [
          {
            id: "1",
            title: "Trending Video 1",
            thumbnail_url: "",
            view_count: "",
            published_at: "2 NOV 2006",
            channel: { name: "", profile_image_url: "" },
          },
        ],
        trendingError: "",
      },
    };
    renderWithMockContext(
      state,
      <MemoryRouter>
        <Trending />
      </MemoryRouter>
    );
    expect(screen.getByText("Trending Video 1")).toBeInTheDocument();
  });

  it("navigates to video details page when a trending video is clicked", () => {
    const state = {
      matches: () => false,
      context: {
        trendingVideosArray: [
          {
            id: "123",
            title: "Trending Video 1",
            thumbnail_url: "",
            view_count: "",
            published_at: "2 NOV 2006",
            channel: { name: "", profile_image_url: "" },
          },
        ],
        trendingError: "",
      },
    };

    // Render with router and a dummy video details route
    render(
      <NxtwatchContext.Provider
        value={{
          themeActor: {},
          loginActor: {},
          dashboardActor: createMockActor(state),
          isDark: false,
        }}
      >
        <MemoryRouter initialEntries={["/trending"]}>
          <Routes>
            <Route path="/trending" element={<Trending />} />
            <Route path="/videos/:id" element={<div data-testid="video-details-page">Video Details Page</div>} />
          </Routes>
        </MemoryRouter>
      </NxtwatchContext.Provider>
    );

    // Find the video title and click it (adjust selector if needed)
    const videoTitle = screen.getByText("Trending Video 1");
    fireEvent.click(videoTitle);

    // Assert navigation to video details page
    expect(screen.getByTestId("video-details-page")).toBeInTheDocument();
  });
});