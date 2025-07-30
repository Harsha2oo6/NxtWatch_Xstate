import { ThemeProvider } from "styled-components";
import Layout from "./Hocs/Layout";
import { GlobalStyle } from "./Hocs/Layout/styledComponents";
import AppRoutes from "./Routes";
import { observer } from "mobx-react-lite";
import  {  useThemeMachine } from "./Components/ExternalWrapper";

const App = observer(() => {
  const { isDark } =useThemeMachine();
  
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
