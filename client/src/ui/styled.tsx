import styled from '@emotion/styled';
import { palette } from '../common/palette';

export const SensorsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  flex-wrap: wrap;
`

export const SensorsHeader = styled.div`
  background-color: ${palette.primary.main};
  color: white;
  padding: 0.75rem;
`;
