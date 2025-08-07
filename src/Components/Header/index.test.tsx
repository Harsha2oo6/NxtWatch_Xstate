import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "./index";
import * as NxtwatchContextModule from "../../Hocs/NxtwatchMachineWrapper";
import Layout from "../../Hocs/Layout";
import Home from "../Home";

// ✅ Dummy actors to mock the machine context
const mockActor = {
  getSnapshot: () => ({}),
  subscribe: () => ({ unsubscribe: () => {} }),
  send: () => {},
};

const defaultContextValue = {
  themeActor: mockActor,
  loginActor: mockActor,
  dashboardActor: mockActor,
  isDark: true,
};

// 🔧 Utility to render Header with mocked context and routing
const renderWithProviders = (contextValue: any = defaultContextValue) => {
  vi.spyOn(NxtwatchContextModule, "useNxtwatchContext").mockImplementation(
    () => contextValue
  );

  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="*" element={<Header />} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </MemoryRouter>
  );
};

describe(" Header Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the Header component with expected elements", () => {
    renderWithProviders();
    expect(screen.getByAltText("header-logo")).toBeInTheDocument();
    expect(screen.getByAltText("profile")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("should switch logo image based on theme (light/dark)", () => {
    const { rerender } = render(
      <MemoryRouter>
        <NxtwatchContextModule.NxtwatchContext.Provider
          value={{ ...defaultContextValue, isDark: false }}
        >
          <Header />
        </NxtwatchContextModule.NxtwatchContext.Provider>
      </MemoryRouter>
    );

    const logo = screen.getByAltText("header-logo") as HTMLImageElement;
    expect(logo.src).toContain("nxt-watch-logo-light-theme-img.png");

    rerender(
      <MemoryRouter>
        <NxtwatchContextModule.NxtwatchContext.Provider
          value={{ ...defaultContextValue, isDark: true }}
        >
          <Header />
        </NxtwatchContextModule.NxtwatchContext.Provider>
      </MemoryRouter>
    );

    const updatedLogo = screen.getByAltText("header-logo") as HTMLImageElement;
    expect(updatedLogo.src).toContain("nxt-watch-logo-dark-theme-img.png");
  });

  it("should navigate to Home Page on clicking logo", () => {
    renderWithProviders();
    fireEvent.click(screen.getByAltText("header-logo"));
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  // it("should gracefully handle missing context values", () => {
  //   const brokenContext = { isDark: false }; // Missing actors
  //   vi.spyOn(NxtwatchContextModule, "useNxtwatchContext").mockImplementation(
  //     () => brokenContext as any
  //   );

  //   render(
  //     <MemoryRouter>
  //       <Header />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByAltText("header-logo")).toBeInTheDocument();
  //   expect(screen.getByAltText("profile")).toBeInTheDocument();
  // });

  // it("should do nothing harmful when clicking non-interactive elements", () => {
  //   renderWithProviders();
  //   const profile = screen.getByAltText("profile");
  //   fireEvent.click(profile);
  //   expect(screen.getByAltText("header-logo")).toBeInTheDocument();
  // });

  // it("should render logo properly in both light and dark modes", () => {
  //   const { rerender } = render(
  //     <MemoryRouter>
  //       <NxtwatchContextModule.NxtwatchContext.Provider
  //         value={{ ...defaultContextValue, isDark: false }}
  //       >
  //         <Header />
  //       </NxtwatchContextModule.NxtwatchContext.Provider>
  //     </MemoryRouter>
  //   );
  //   const logo = screen.getByAltText("header-logo") as HTMLImageElement;
  //   expect(logo.src).toContain("light");

  //   rerender(
  //     <MemoryRouter>
  //       <NxtwatchContextModule.NxtwatchContext.Provider
  //         value={{ ...defaultContextValue, isDark: true }}
  //       >
  //         <Header />
  //       </NxtwatchContextModule.NxtwatchContext.Provider>
  //     </MemoryRouter>
  //   );
  //   const darkLogo = screen.getByAltText("header-logo") as HTMLImageElement;
  //   expect(darkLogo.src).toContain("dark");
  // });
});
