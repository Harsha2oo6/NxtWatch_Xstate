import { useNavigate } from "react-router-dom";
import {
  HeaderWrapper,
  LogoImage,
  ProfileImg,
  ActionsWrapper,
} from "./styledComponents";
import {
  DarkThemeLogo,
  LightThemeLogo,
  ProfileImage,
} from "../../Common/Images";
import ThemeTogler from "../../Common/ThemeToggler";
import LogoutPopup from "../LogoutPopup";
import MobileNavigator from "../MobileNavigator";
import { useContext } from "react";
import { Context } from "../../Hocs/ExternalWrapper";
import { useNxtwatchContext } from "../../Hocs/NxtwatchMachineWrapper";

const Header = () => {
  const navigate = useNavigate();
  const { isDark } = useNxtwatchContext()
  return (
    <HeaderWrapper>
      <LogoImage
        onClick={() => navigate("/")}
        src={isDark ? DarkThemeLogo : LightThemeLogo}
        alt="header-logo"
      />
      <ActionsWrapper>
        <ThemeTogler />
        <ProfileImg src={ProfileImage} alt="profile" />
        <MobileNavigator />
        <LogoutPopup />
      </ActionsWrapper>
    </HeaderWrapper>
  );
};

export default Header;
