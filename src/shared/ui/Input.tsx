import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(29,78,216,.15);
  }
`;
