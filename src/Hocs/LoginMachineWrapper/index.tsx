import { useMachine } from "@xstate/react";
import { loginMachineConfig } from "../../Machines/LoginMachine/loginMachine";
import {  createContext } from "react";

export const LoginContext = createContext<{
  loginState: any;
  send: (event: any) => void;
}>({
  loginState: null,
  send: () => {},
});

const LoginMachinewrapper = ({ children }: any) => {
  const [loginState, send] = useMachine(loginMachineConfig);

  return (
    <LoginContext.Provider value={{ loginState, send }}>
      {children}
    </LoginContext.Provider>
  );
};
export default LoginMachinewrapper;

export const useLoginMachine = () => {
  // return useContext(LoginContext);
};
