/**
 * @vitest-environment jsdom
 */

// --- Mocks must be defined before imports ---

const mockNavigate = vi.fn();

const mockSend = vi.fn();
vi.mock("../Hocs/NxtwatchMachineWrapper", () => ({
  useNxtwatchContext: () => ({
    loginActor: { send: mockSend },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --- Imports ---
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LogoutPopup from "../Components/LogoutPopup";

describe("LogoutPopup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Logout button and icon", () => {
    render(
      <MemoryRouter>
        <LogoutPopup />
      </MemoryRouter>
    );
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it("opens the popup when Logout button is clicked", async () => {
    render(
      <MemoryRouter>
        <LogoutPopup />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/logout/i));
    expect(await screen.findByText(/are you sure you want to logout/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm/i)).toBeInTheDocument();
  });

  it("closes the popup when Cancel is clicked", async () => {
    render(
      <MemoryRouter>
        <LogoutPopup />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/logout/i));
    const cancelBtn = await screen.findByText(/cancel/i);
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByText(/are you sure you want to logout/i)).not.toBeInTheDocument();
    });
  });

  it("calls logout and navigates to login on Confirm", async () => {
    // Dynamically import to get the latest mock instance
    const { useNxtwatchContext } = await import("../Hocs/NxtwatchMachineWrapper");
    render(
      <MemoryRouter>
        <LogoutPopup />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/logout/i));
    const confirmBtn = await screen.findByText(/confirm/i);
    fireEvent.click(confirmBtn);
    expect(useNxtwatchContext().loginActor.send).toHaveBeenCalledWith({ type: "LOGOUT" });
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});