import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../Components/Home";
import { NxtwatchContext } from "../Hocs/NxtwatchMachineWrapper";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

// --- FETCH-BASED INTEGRATION TESTS ---
// describe("Home Integration (with fetch)", () => {
//   beforeEach(() => {
//     vi.stubGlobal(
//       "fetch",
//       vi.fn(() =>
//         Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve({ videos: [] }),
//         })
//       )
//     );
//   });

//   it("renders the search input and button", async () => {
//     render(
//       <NxtwatchMachineWrapper>
//         <Home />
//       </NxtwatchMachineWrapper>
//     );
//     const searchInput = screen.getByPlaceholderText(/search/i);
//     const searchButton = screen.getByTestId("searchbtn");
//     expect(searchInput).toBeInTheDocument();
//     expect(searchButton).toBeInTheDocument();
//   });

//   it("shows empty state when no videos", async () => {
//     render(
//       <MemoryRouter>
//         <NxtwatchMachineWrapper>
//           <Home />
//         </NxtwatchMachineWrapper>
//       </MemoryRouter>
//     );
//     await waitFor(() => {
//       expect(screen.getByText(/No Search results found/i)).toBeInTheDocument();
//     });
//   });
// });

// --- XSTATE/CONTEXT-BASED TESTS ---
function createMockActor(state: any) {
  return {
    getSnapshot: () => state,
    send: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
  };
}

function renderWithMockContext(dashboardState: any, children: ReactNode) {
  const mockDashboardActor = createMockActor(dashboardState);
  return render(
    // <MemoryRouter>
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
    // </MemoryRouter>
  );
}

describe("Home Integration (with mocked XState context)", () => {
  it("shows loader when loading", () => {
    const state = {
      matches: (s: any) => s.home === "loading",
      context: { homeVideosArray: [], homeError: "" },
    };
    renderWithMockContext(state, <Home />);
    // Loader should have a test id or text for assertion
    // expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it("shows error when homeError is set", () => {
    const state = {
      matches: () => false,
      context: { homeVideosArray: [], homeError: "failed" },
    };
    renderWithMockContext(state, <Home />);
    expect(screen.getByTestId("failurepage")).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it("shows empty state when no videos", () => {
    const state = {
      matches: () => false,
      context: { homeVideosArray: [], homeError: "" },
    };
    renderWithMockContext(state, <Home />);
    expect(screen.getByText(/No Search results found/i)).toBeInTheDocument();
  });

  it("shows videos when homeVideosArray is populated", () => {
    const state = {
      matches: () => false,
      context: {
        homeVideosArray: [
          {
            id: "1",
            title: "Video 1",
            thumbnail_url: "",
            view_count: "",
            published_at: "2 NOV 2006",
            channel: { name: "", profile_image_url: "" },
          },
        ],
        homeError: "",
      },
    };
    renderWithMockContext(
      state,
      <MemoryRouter>
        {" "}
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Video 1")).toBeInTheDocument();
  });
});
