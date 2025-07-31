import { createContext } from "react";
import ThemeMachine from "../../Machines/ThemeMachine/themeMachine";
import { useActor } from "@xstate/react";

export const Context = createContext<{
  themeState: any;
  toggle: () => void;
  isDark: boolean;
}>({
  themeState: null,
  toggle: () => {},
  isDark: false,
});

const ExternalWrapper = ({ children }: any) => {
  const [state, send] = useActor(ThemeMachine);

  const isDark = state.context.currentTheme === "dark";
  return (
    <Context.Provider
      value={{
        isDark,
        themeState: { state },
        toggle: () => send({ type: "toggle" }),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ExternalWrapper;

export const useThemeMachine = () => {
  // return useContext(Context);
};
