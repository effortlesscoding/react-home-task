import styled from '@emotion/styled';
import { palette } from '../../palette';

const Button = styled.button`
    border: 0;
    padding: 0.25rem;
    cursor: pointer;
    &.primary {
        background-color: ${palette.primary.main};
        color: white;
    }
    &.secondary {
        background-color: ${palette.secondary.main};
        color: black;
    }
    &:hover {
        opacity: 0.8;
    }
`;

export { Button };