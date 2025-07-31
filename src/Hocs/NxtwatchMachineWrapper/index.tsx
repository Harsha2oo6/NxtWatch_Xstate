import { useMachine, useSelector } from "@xstate/react";
import { createContext, useContext } from "react";
import NxtwatchMachineConfig from "../../Machines/NxtwatchMachine/nxtwatchMachine";

export const NxtwatchContext = createContext<{
  themeActor:any,
  loginActor:any,
  dashboardActor:any,
  isDark:boolean
}>({   themeActor:{},
  loginActor:{},
  dashboardActor:{}, 
isDark:false});
const NxtwatchMachineWrapper = ({ children }: any) => {
  const [state] = useMachine(NxtwatchMachineConfig);
  // const child=state.children
  // console.log("state",{child})
  // console.log("send",{send})
  // console.log("actor",{actor})
  const {app,loginMachine,themeMachine}=state.children
  const isDark=useSelector(themeMachine,(state:any)=>state.context.currentTheme==='dark')
//   console.log(app,loginMachine,themeMachine)
  return (
    <NxtwatchContext.Provider value={{ themeActor:themeMachine,loginActor:loginMachine,dashboardActor:app ,isDark}}>
      {children}
    </NxtwatchContext.Provider>
  );
};
export default NxtwatchMachineWrapper;

export const useNxtwatchContext = () => {
  return useContext(NxtwatchContext);
};
