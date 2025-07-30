import {
  FailureImage,
  Heading,
  SubHeading,
  Description,
  FailureWrapper,
} from './styledComponents';
import { RetryButton } from '../NoVideosFound/styledComponents';
import { useThemeMachine } from '../../Components/ExternalWrapper';

type RenderFailureProps = {
  onRetry: () => void;
};

const RenderFailure = ({ onRetry }: RenderFailureProps) => {
  const {isDark}=useThemeMachine()
  return (
    <FailureWrapper>
      <FailureImage
        src={
          isDark
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
        }
        alt="failed"
      />
      <Heading>Oops! Something went wrong</Heading>
      <SubHeading>
        We are having some trouble to complete your request.
      </SubHeading>
      <Description>Please try again</Description>
      <RetryButton onClick={onRetry}>Retry</RetryButton>
    </FailureWrapper>
  );
};

export default RenderFailure;
