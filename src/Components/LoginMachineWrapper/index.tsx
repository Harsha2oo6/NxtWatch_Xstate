import { useMachine } from "@xstate/react";
import { loginMachineConfig } from "../../Stores/LoginMachine/loginMachine";
import { useContext, createContext } from "react";

export const LoginContext = createContext<{
  loginState: any;
  send: (event: any) => void;
 
}>({
  loginState: null,
  send: () => {},
});

const LoginMachinewrapper = ({ children }: any) => {
  const [loginState, send] = useMachine(loginMachineConfig);

  // console.log({loginState})
  return (
    <LoginContext.Provider value={{ loginState, send }}>
      {children}
    </LoginContext.Provider>
  );
};
export default LoginMachinewrapper;

export const useLoginMachine = () => {
  return useContext(LoginContext);
};
