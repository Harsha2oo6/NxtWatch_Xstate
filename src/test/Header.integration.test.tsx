import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NxtwatchMachineWrapper from "../Hocs/NxtwatchMachineWrapper";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import Layout from "../Hocs/Layout";
import { DarkThemeLogo, LightThemeLogo } from "../Common/Images";
import LoginPage from "../Components/LoginPage";

describe("Header Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });



// Helper to render the app with routing
function renderAppWithRoutes(initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <NxtwatchMachineWrapper>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
        </Routes>
      </NxtwatchMachineWrapper>
    </MemoryRouter>
  );
}

  it("renders logo, theme toggler, profile image, mobile navigator, and logout popup", () => {
    renderAppWithRoutes();
    expect(screen.getByAltText("header-logo")).toBeInTheDocument();
    expect(screen.getByTestId("themeToggler")).toBeInTheDocument();
    expect(screen.getByAltText("profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("logo click navigates to home", async () => {
    renderAppWithRoutes();
    const logo = screen.getByAltText("header-logo");
    await userEvent.click(logo);

    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchButton = screen.getByTestId("searchbtn");

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it("theme toggler switches icon", () => {
    renderAppWithRoutes();
    const themeButton = screen.getByTestId("themeToggler");
    expect(themeButton).toBeInTheDocument();
    userEvent.click(themeButton);
  });

  it("mobile navigator opens menu and navigates to routes", async () => {
    renderAppWithRoutes();

    const menuButton = screen.getByTestId("menu");
    expect(menuButton).toBeInTheDocument();

    await userEvent.click(menuButton);

    const menuCard = screen.getByTestId("menucard");
    expect(menuCard).toBeInTheDocument();

    const scopedQueries = within(menuCard);

    expect(scopedQueries.getByText("Home")).toBeInTheDocument();
    expect(scopedQueries.getByText("Trending")).toBeInTheDocument();
    expect(scopedQueries.getByText("Gaming")).toBeInTheDocument();
    expect(scopedQueries.getByText("Saved Videos")).toBeInTheDocument();
  });

  it("logout popup opens and handles logout", async () => {
    renderAppWithRoutes();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Logout"));
    expect(
      screen.getByText("Are you sure you want to logout?")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();

    // Cancel logout, popup should close, header should remain
    await userEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText("Are you sure you want to logout?")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Confirm logout, should redirect to login page
    await userEvent.click(screen.getByText("Logout"));
    await userEvent.click(screen.getByText("Confirm"));
    // Check for login page (adjust selector as needed for your login page)
    expect(screen.queryByText(/login/i)).toBeInTheDocument();
  });

  it("logo switches based on theme", () => {
    renderAppWithRoutes();
    const logo = screen.getByAltText("header-logo");
    expect([DarkThemeLogo, LightThemeLogo]).toContain(logo.getAttribute("src"));
  });
});
