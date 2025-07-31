import { ThemeProvider } from "styled-components";
import Layout from "./Hocs/Layout";
import { GlobalStyle } from "./Hocs/Layout/styledComponents";
import AppRoutes from "./Routes";
import { useThemeMachine } from "./Hocs/ExternalWrapper";
import { useMachine, useSelector } from "@xstate/react";
import { useNxtwatchContext } from "./Hocs/NxtwatchMachineWrapper";




const App = () => {
  // const { isDark } = useThemeMachine();
  const { isDark} = useNxtwatchContext();

  // console.log(isDark)
  return (
    <ThemeProvider theme={{ isDark }}>
      <GlobalStyle />
      <Layout>
        <AppRoutes />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
