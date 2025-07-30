import { assign, createMachine, fromPromise} from "xstate";
import Cookies from "js-cookie";
import { LoginService } from "../../Services/LoginServices";


type LoginDetails = {
  username: string;
  password: string;
  token: string;
  showPassword: boolean;
  error: string;
};
// type Events =
//   | { type: "SET_USERNAME"; value: string }
//   | { type: "SET_PASSWORD"; value: string }
//   | { type: "SHOW_PASSWORD" }
//   | { type: "LOGIN" }
//   | { type: "LOGOUT" };

export const loginMachineConfig =createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7AsgQwGMALbMAOgwmTAGIBlAUQBUB9AVUYCUA5AQRwYBtAAwBdRKAAOqWBgAuGVFgkgAHogCsAJjIaAbFoAsADgDsp4QEY9AThuXDAGhABPRFtMBmMoeEHPhpbCnnp6lp4aAL6RzmiYuIQkWOSU1PTMLAAKvHR0AOoA8pwAIiLiSCDSsgpKKuoIGpZkplp6Gvp6Jm2tes5uCJbmPhqeltZ6nsYahhHG0bHo2PjEpBRUtHQAEgV5WTn5RaViKlXyisoV9YZafYjGTYZ2T4MBWhpzMSBxS4mrqbQAGQKAHEAJLcMonGRnWqXdyPZqPGymWzCcyTIy3BCTDRkGzGGZhExaAkoqKfb4JFbJMhxeJQFjYGgQJQpLAAN1QAGtyJTlkleeh6YysAhsJyCHgalgypCKqdpXVEKZ2rpLPoMfYtK1PFiIk0AmNPDZRjYZsJDPMvosqQLaULsAymWAAE4u1AusiSZBSgBmHoAtvb4vzVnTHSKxRzUJLpbLjvLoYq4QgjDZEXYUTY0V5jJjXO4TWRgpYtJNjMJtNobFa+b8abAAK4EAhwWA0IHAgpsJhyqRJ85KhDInRWfRaSuWYx6Uw2LEOdPtQx6Cto1pm6KfLCoCBwFR16lgKHVQcpgC0vQLCAvxeEd8rhg0s46xhrFJtoZp-2PMIuoHqr54kEU5TEYIw2CuepeMWM6oo0nRaMitYfvWgpQMK2A-sm-6aPYwyjFowEhHexh6gi+jmMI2rGASeb6MhIaoWQTYtm2WGnjhAzCPiugGI0JHXBoZp6iEZDqkEITWNohqeJukRAA */
    id: "loginMachine",
    initial: "idle",
    types: {
      context: {} as LoginDetails,
    },
    context: {
      username: Cookies.get("username") || "",
      password: "",
      showPassword: false,
      error: "",
      token: Cookies.get("jwt_token") || "",
    },
    states: {
      idle: {
        on: {
          SET_USERNAME: {
            actions: assign(({ event }) => {
              console.log("username");
              return { username: event.value };
            }),
          },

          SET_PASSWORD: {
            actions: assign(({ event }) => {
              return { password: event.value };
            }),
          },

          SHOW_PASSWORD: {
            actions: assign(({ context }) => {
              return { showPassword: !context.showPassword };
            }),
          },

          LOGIN: "logging_in",
        },
      },

      logging_in: {
        invoke: {
          src: fromPromise(async ({ input }: { input: LoginDetails }) => {
            console.log({ input }, "context in logging api call");
            return LoginService({
              username: input.username,
              password: input.password,
            });
          }),
          input: ({ context }) => {
            console.log({ context }, "context in input");
            return context;
          },
          onDone: {
            target: "success",
            actions: assign({
              token: ({ event, context }) => {
                Cookies.set("jwt_token", event.output.jwt_token);
                Cookies.set("username", context.username);
                return event.output.jwt_token;
              },
            }),
          },
          onError: {
            target: "idle",
            actions: assign({
              error: ({ event }) => {
                console.log({ event });
                return "abc";
              },
            }),
          },
        },
      },

      success: {
        on: {
          LOGOUT: {
            target: "idle",
            actions: assign(() => {
              Cookies.remove("jwt_token");
              Cookies.remove("username");
              return {
                username: "",
                password: "",
                token: "",
                error: "",
                showPassword: false,
              };
            }),
          },
        },
      },
    },
  }
);
// setup({
//     types:{
//         context:{}as LoginDetails,
//         events:{} as Events
//     }
// }).