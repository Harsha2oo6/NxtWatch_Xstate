import { DarkmodeIcon, LightmodeIcon } from "../../Common/Icons";
import { ThemeButton } from "./styledComponents";

import { useThemeMachine } from "../../Components/ExternalWrapper";

const ThemeTogler = () => {
  const { isDark, toggle } = useThemeMachine();
  return (
    <ThemeButton onClick={toggle}>
      {isDark ? <LightmodeIcon /> : <DarkmodeIcon />}
    </ThemeButton>
  );
};
export default ThemeTogler;
