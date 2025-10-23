import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;
export const Spinner = styled.div`
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(0,0,0,.15); border-top-color: #fff;
  animation: ${spin} .8s linear infinite;
`;