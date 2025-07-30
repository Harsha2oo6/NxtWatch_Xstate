import { ThemeProvider } from "styled-components";
import Layout from "./Hocs/Layout";
import { GlobalStyle } from "./Hocs/Layout/styledComponents";
import AppRoutes from "./Routes";
import { observer } from "mobx-react-lite";
import  {  useThemeMachine } from "./Components/ExternalWrapper";

const App = observer(() => {
  const { themeState,isDark } =useThemeMachine();
  console.log(themeState)
  return (
    <ThemeProvider theme={{ isDark }}>
      <GlobalStyle />
      <Layout>
        <AppRoutes />
      </Layout>
    </ThemeProvider>
  );
});

export default App;
