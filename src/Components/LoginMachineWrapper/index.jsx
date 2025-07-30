import { useMachine } from "@xstate/react";

const LoginContext = createContext();

const useLoginMachine = ({ children }) => {
  const [state, send] = useMachine(loginMachineConfig);

  return (
    <LoginContext.Provider value={{ state, send }}>
      {children}
    </LoginContext.Provider>
  );
};
export default useLoginMachine;
