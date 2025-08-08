import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Gaming from "../Components/Gaming";
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

describe("Gaming Integration (with mocked XState context)", () => {
  it("shows loader when loading", () => {
    const state = {
      matches: (s: any) => s.gaming === "loading",
      context: { gamingVideosArray: [], gamingError: "" },
    };
    renderWithMockContext(state, <Gaming />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it("shows error when gamingError is set", () => {
    const state = {
      matches: () => false,
      context: { gamingVideosArray: [], gamingError: "failed" },
    };
    renderWithMockContext(state, <Gaming />);
    expect(screen.getByTestId("failurepage")).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it("shows videos when gamingVideosArray is populated", () => {
    const state = {
      matches: () => false,
      context: {
        gamingVideosArray: [
          {
            id: "1",
            title: "Gaming Video 1",
            thumbnail_url: "",
            view_count: "",
          },
        ],
        gamingError: "",
      },
    };
    renderWithMockContext(
      state,
      <MemoryRouter>
        <Gaming />
      </MemoryRouter>
    );
    expect(screen.getByText("Gaming Video 1")).toBeInTheDocument();
  });

  it("navigates to video details page when a gaming video is clicked", () => {
    const state = {
      matches: () => false,
      context: {
        gamingVideosArray: [
          {
            id: "123",
            title: "Gaming Video 1",
            thumbnail_url: "",
            view_count: "",
          },
        ],
        gamingError: "",
      },
    };

    render(
      <NxtwatchContext.Provider
        value={{
          themeActor: {},
          loginActor: {},
          dashboardActor: createMockActor(state),
          isDark: false,
        }}
      >
        <MemoryRouter initialEntries={["/gaming"]}>
          <Routes>
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/videos/:id" element={<div data-testid="video-details-page">Video Details Page</div>} />
          </Routes>
        </MemoryRouter>
      </NxtwatchContext.Provider>
    );

    const videoTitle = screen.getByText("Gaming Video 1");
    fireEvent.click(videoTitle);

    expect(screen.getByTestId("video-details-page")).toBeInTheDocument();
  });
});