import { observer } from "mobx-react-lite";
import Header from "../../Components/Header";
import SideNavBar from "../../Components/Sidenavbar";
import { LayoutWrapper, NavContentWrapper } from "./styledComponents";
import type { JSX } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import LoginMachinewrapper from "../../Components/LoginMachineWrapper";

type props = {
  children: JSX.Element;
};
const Layout = observer(({ children }: props) => {
  const location = useLocation();
  const isLogged = location.pathname !== "/login";
  
  return (
    <LoginMachinewrapper>
    <LayoutWrapper>
        
      {isLogged && <Header  />}
      {isLogged ? (
        <NavContentWrapper>
          {<SideNavBar />}
          {children}
        </NavContentWrapper>
      ) : (
        children
      )}
    </LayoutWrapper>
    </LoginMachinewrapper>
  );
});
export default Layout;
