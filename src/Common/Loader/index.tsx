import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import { useThemeMachine } from "../../Components/ExternalWrapper";

const LoaderWrapper = styled.div`
  min-height: 50vh; 
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => (theme.isDark ? "#181818" : "#f8f8f4")};
`;

const Loader = () => {
    const {isDark}=useThemeMachine()
  return (
    <LoaderWrapper>
      <BeatLoader size={13} color={isDark ? "white" : "#000"} />
    </LoaderWrapper>
  );
};

export default Loader;
