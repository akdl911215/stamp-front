import styled from "styled-components";

export const Button = styled.button<{ full?: boolean }>`
  display: inline-flex; align-items: center; justify-content: center;
  width: ${({ full }) => (full ? "100%" : "auto")};
  height: 44px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  transition: filter .15s ease;
  &:hover { filter: brightness(0.97); }
  &:disabled { opacity: .6; pointer-events: none; }
`;