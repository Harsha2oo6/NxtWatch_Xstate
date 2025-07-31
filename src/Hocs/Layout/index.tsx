import Header from "../../Components/Header";
import SideNavBar from "../../Components/Sidenavbar";
import { LayoutWrapper, NavContentWrapper } from "./styledComponents";
import type { JSX } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import LoginMachinewrapper from "../../Components/LoginMachineWrapper";
import DashboardMachineWrapper from "../../Components/DashboardMachineWrapper";

type props = {
  children: JSX.Element;
};
const Layout = ({ children }: props) => {
  const location = useLocation();
  const isLogged = location.pathname !== "/login";

  return (
    <LoginMachinewrapper>
      <DashboardMachineWrapper>
        <LayoutWrapper>
          {isLogged && <Header />}
          {isLogged ? (
            <NavContentWrapper>
              {<SideNavBar />}
              {children}
            </NavContentWrapper>
          ) : (
            children
          )}
        </LayoutWrapper>
      </DashboardMachineWrapper>
    </LoginMachinewrapper>
  );
};
export default Layout;
