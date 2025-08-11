import { createActor } from "xstate";
import { loginMachineConfig } from "./loginMachine";

// Mock js-cookie and LoginService
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));
vi.mock("../../Services/LoginServices", () => ({
  LoginService: vi.fn(),
}));

import Cookies from "js-cookie";
import  {LoginService}  from "../../Services/LoginServices";

describe("loginMachineConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    Cookies.get.mockImplementation((key: string) => {
      if (key === "username") return "";
      if (key === "jwt_token") return "";
      return undefined;
    });
  });

  it("should initialize with default context", () => {
    const actor = createActor(loginMachineConfig);
    actor.start();
    expect(actor.getSnapshot().context).toMatchObject({
      username: "",
      password: "",
      showPassword: false,
      error: "",
      token: "",
    });
  });

  it("should update username on SET_USERNAME", () => {
    const actor = createActor(loginMachineConfig);
    actor.start();
    actor.send({ type: "SET_USERNAME", value: "testuser" });
    expect(actor.getSnapshot().context.username).toBe("testuser");
  });

  it("should update password on SET_PASSWORD", () => {
    const actor = createActor(loginMachineConfig);
    actor.start();
    actor.send({ type: "SET_PASSWORD", value: "secret" });
    expect(actor.getSnapshot().context.password).toBe("secret");
  });

  it("should toggle showPassword on SHOW_PASSWORD", () => {
    const actor = createActor(loginMachineConfig);
    actor.start();
    expect(actor.getSnapshot().context.showPassword).toBe(false);
    actor.send({ type: "SHOW_PASSWORD" });
    expect(actor.getSnapshot().context.showPassword).toBe(true);
    actor.send({ type: "SHOW_PASSWORD" });
    expect(actor.getSnapshot().context.showPassword).toBe(false);
  });

  it("should transition to logging_in on LOGIN", () => {
    const actor = createActor(loginMachineConfig);
    actor.start();
    actor.send({ type: "LOGIN" });
    expect(actor.getSnapshot().value).toBe("logging_in");
  });

  it("should call LoginService and transition to LoggedIn on success", async () => {
    // @ts-ignore
    LoginService.mockResolvedValue({ jwt_token: "abc123" });
    const actor = createActor(loginMachineConfig);
    actor.start();
    actor.send({ type: "SET_USERNAME", value: "testuser" });
    actor.send({ type: "SET_PASSWORD", value: "secret" });
    actor.send({ type: "LOGIN" });

    // Wait for async transition
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(LoginService).toHaveBeenCalledWith({
      username: "testuser",
      password: "secret",
    });
    expect(actor.getSnapshot().value).toBe("LoggedIn");
    expect(actor.getSnapshot().context.token).toBe("abc123");
    expect(Cookies.set).toHaveBeenCalledWith("jwt_token", "abc123");
    expect(Cookies.set).toHaveBeenCalledWith("username", "testuser");
  });

  it("should handle LoginService error and set error in context", async () => {
    // @ts-ignore
    LoginService.mockRejectedValue({ error_msg: "Invalid credentials" });
    const actor = createActor(loginMachineConfig);
    actor.start();
    actor.send({ type: "SET_USERNAME", value: "testuser" });
    actor.send({ type: "SET_PASSWORD", value: "wrongpass" });
    actor.send({ type: "LOGIN" });

    // Wait for async transition
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(LoginService).toHaveBeenCalledWith({
      username: "testuser",
      password: "wrongpass",
    });
    expect(actor.getSnapshot().value).toBe("idle");
    expect(actor.getSnapshot().context.error).toBe("Invalid credentials");
  });

  it("should clear context and cookies on LOGOUT", async () => {
    // @ts-ignore
    LoginService.mockResolvedValue({ jwt_token: "abc123" });
    const actor = createActor(loginMachineConfig);
    actor.start();
    actor.send({ type: "SET_USERNAME", value: "testuser" });
    actor.send({ type: "SET_PASSWORD", value: "secret" });
    actor.send({ type: "LOGIN" });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(actor.getSnapshot().value).toBe("LoggedIn");

    actor.send({ type: "LOGOUT" });
    expect(actor.getSnapshot().value).toBe("idle");
    expect(actor.getSnapshot().context).toMatchObject({
      username: "",
      password: "",
      token: "",
      error: "",
      showPassword: false,
    });
    expect(Cookies.remove).toHaveBeenCalledWith("jwt_token");
    expect(Cookies.remove).toHaveBeenCalledWith("username");
  });
});