import Popup from "reactjs-popup";
import type { ReactNode } from "react";
import { ModalWrapper, PopupButton, RowDiv, Sure } from "./styledComponents";
import { MenuButton } from "../MobileNavigator/styledComponents";
import { LogoutIcon } from "../../Common/Icons";
import { useLoginMachine } from "../LoginMachineWrapper";
import { useNavigate } from "react-router-dom";

const LogoutPopup = () => {
  const navigate = useNavigate();
  const { loginState, send } = useLoginMachine();

  const handleLogout = () => {
    console.log("logingout");
    console.log({ loginState, send });
    send({ type: "LOGOUT" });
    navigate("/login", { replace: true });
  };
  return (
    <Popup
      modal
      trigger={
        <div>
          <PopupButton className="logout">Logout</PopupButton>
          <MenuButton>
            <LogoutIcon />
          </MenuButton>
        </div>
      }
    >
      {
        ((close: () => void) => (
          <ModalWrapper>
            <Sure>Are you sure you want to logout?</Sure>
            <RowDiv>
              <PopupButton className="close" onClick={close}>
                Cancel
              </PopupButton>
              <PopupButton className="confirm" onClick={handleLogout}>
                Confirm
              </PopupButton>
            </RowDiv>
          </ModalWrapper>
        )) as any as ReactNode
      }
    </Popup>
  );
};

export default LogoutPopup;
