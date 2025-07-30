import { observer } from "mobx-react-lite";
import { type FormEvent } from "react";
import { loginStore } from "../../Stores/LoginStore/loginstore";
import { useNavigate } from "react-router-dom";
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
import { themeStore } from "../../Stores/ThemeStore/themeStore";
import { DarkThemeLogo, LightThemeLogo } from "../../Common/Images";
import ThemeTogler from "../../Common/ThemeToggler";

const LoginPage = observer(() => {
  const [state, send] = useLoginMachine();


  const navigate = useNavigate();
  if (loginStore.getToken() !== "") {
    navigate("/", { replace: true });
  }
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // console.log("inputs sent");
    send({ type: "LOGIN" });
  };
  return (
    <LoginPageWrapper>
      <Modetoggler>
        <ThemeTogler />
      </Modetoggler>
      <FormWrapper onSubmit={handleLogin}>
        <LoginLogo
          src={themeStore.isDark ? DarkThemeLogo : LightThemeLogo}
          alt="Nxtwatch"
        />
        <InputWrapper>
          <LabelElement htmlFor="username">USERNAME</LabelElement>
          <LoginIputBar
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e)=>send({type:"SET_USERNAME",value:e.target.value})}
          />
        </InputWrapper>
        <InputWrapper>
          <LabelElement htmlFor="password">PASSWORD</LabelElement>
          <LoginIputBar
            type={state.context.showPassword? "text" : "password"}
            placeholder="Password"
            id="password"
            onChange={(e)=>send({type:"SET_PASSWORD",value:e.target.value})}
          />
        </InputWrapper>
        <ShowPassWrapper>
          <CheckBox
            id="showpass"
            type="checkbox"
            onChange={()=>send({type:'SHOW_PASSWORD'})}
          />
          <LabelElement htmlFor="showpass">Show Password</LabelElement>
        </ShowPassWrapper>
        <LoginButton type="submit">Login</LoginButton>
        {loginStore.error && <ErrorTag>{loginStore.error}</ErrorTag>}
      </FormWrapper>
    </LoginPageWrapper>
  );
});
export default LoginPage;
