import { ThemeProvider } from "styled-components";
import Layout from "./Hocs/Layout";
import { GlobalStyle } from "./Hocs/Layout/styledComponents";
import AppRoutes from "./Routes";
import { useThemeMachine } from "./Components/ExternalWrapper";

const App = () => {
  const { isDark } = useThemeMachine();

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
