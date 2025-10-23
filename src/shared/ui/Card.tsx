import styled from "styled-components";

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 28px;
`;