import { DarkmodeIcon, LightmodeIcon } from "../../Common/Icons";
import { ThemeButton } from "./styledComponents";

import { useThemeMachine } from "../../Hocs/ExternalWrapper";
import { useNxtwatchContext } from "../../Hocs/NxtwatchMachineWrapper";
import { useSelector } from "@xstate/react";

const ThemeTogler = () => {
  const { themeActor,isDark}=useNxtwatchContext();
  return (
    <ThemeButton data-testid="themeToggler" onClick={()=>themeActor.send({type:"toggle"})}>
      {isDark ? <LightmodeIcon /> : <DarkmodeIcon />}
    </ThemeButton>
  );
};
export default ThemeTogler;
