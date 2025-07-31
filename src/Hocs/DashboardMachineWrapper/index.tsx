import { createContext, useContext } from "react";
import { useMachine } from "@xstate/react";
import { dashboardMachineConfig } from "../../Machines/DashboardMachine/dashboardMachine";

export const Dashboardcontext = createContext<{
  state: any;
  send: (event: any) => void;
}>({ state: null, send: () => {} });

const DashboardMachineWrapper = ({ children }: any) => {
  const [state, send] = useMachine(dashboardMachineConfig);

  return (
    <Dashboardcontext.Provider value={{ state, send }}>
      {children}
    </Dashboardcontext.Provider>
  );
};

export default DashboardMachineWrapper;

export const useDashboardMachine = () => {
  // return useContext(Dashboardcontext);
};
