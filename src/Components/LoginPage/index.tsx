import { type FormEvent } from "react";
import {
  FormWrapper,
  LoginButton,
  LoginIputBar,
  LoginLogo,
  ErrorTag,
  Modetoggler,
  LoginPageWrapper,
  InputWrapper,
  CheckBox,
  ShowPassWrapper,
  LabelElement,
} from "./styledComponents";
import { DarkThemeLogo, LightThemeLogo } from "../../Common/Images";
import ThemeTogler from "../../Common/ThemeToggler";
import { useLoginMachine } from "../../Hocs/LoginMachineWrapper";
import { useNavigate } from "react-router-dom";
import { useThemeMachine } from "../../Hocs/ExternalWrapper";
import { useNxtwatchContext } from "../../Hocs/NxtwatchMachineWrapper";
import { useActor, useSelector } from "@xstate/react";

const LoginPage = () => {
  const navigate = useNavigate();

  const { themeActor,loginActor,isDark } = useNxtwatchContext();

  // console.log(themeActor)

  // const themeContext = useSelector(themeActor, (state: any) => state.context);
  // console.log(themeContext);

  const newloginState = useSelector(loginActor, (state: any) => state);
  // console.log(newloginState);

  // const {  send } = useLoginMachine();
  // const { isDark } = useThemeMachine();


  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    loginActor.send({ type: "LOGIN" });
  };
  if (newloginState.matches("LoggedIn")) {
    navigate("/", { replace: true });
  }
  return (
    <LoginPageWrapper>
      <Modetoggler>
        <ThemeTogler />
      </Modetoggler>
      <FormWrapper onSubmit={handleLogin}>
        <LoginLogo
          src={isDark ? DarkThemeLogo : LightThemeLogo}
          alt="Nxtwatch"
        />
        <InputWrapper>
          <LabelElement htmlFor="username">USERNAME</LabelElement>
          <LoginIputBar
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) =>
              loginActor.send({ type: "SET_USERNAME", value: e.target.value })
            }
          />
        </InputWrapper>
        <InputWrapper>
          <LabelElement htmlFor="password">PASSWORD</LabelElement>
          <LoginIputBar
            type={newloginState.context.showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            onChange={(e) =>
              loginActor.send({ type: "SET_PASSWORD", value: e.target.value })
            }
          />
        </InputWrapper>
        <ShowPassWrapper>
          <CheckBox
            id="showpass"
            type="checkbox"
            onChange={() => loginActor.send({ type: "SHOW_PASSWORD" })}
          />
          <LabelElement htmlFor="showpass">Show Password</LabelElement>
        </ShowPassWrapper>
        <LoginButton type="submit">Login</LoginButton>
        {newloginState.context.error && (
          <ErrorTag>{newloginState.context.error}</ErrorTag>
        )}
      </FormWrapper>
    </LoginPageWrapper>
  );
};
export default LoginPage;
