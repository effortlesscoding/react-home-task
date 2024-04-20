import styled from '@emotion/styled'
import { palette } from '../../common/palette';

/**
 * Using classes instead of (props) => props.connected ? '' : '' because it doesn't
 * re-generate CSS dynamically every time props change
 */
export const ConnectionStatus = styled.div`
  style: inline-block;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &.connected {
    background-color: ${palette.success.main};
    color: purple;
  }

  &.disconnected {
    background-color: ${palette.danger.main};
    color: white;
  }
`;

export const ConnectionBlock = styled.div`
  display: flex;
  gap: .25rem;
  align-items: center;
`;

export const SensorName = styled.h3`
  margin: 0 0 1rem 0;
`

export const Container = styled.div`
  background-color: white;
  border: 1px solid ${palette.primary.main};
  padding: 0.5rem;
  max-width: 25vw;
  min-width: 30%;
  flex: 1;

  button {
    margin-right: 0.5rem;
  }
`;
