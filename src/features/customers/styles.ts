import styled from "styled-components";

export const Button2 = styled.button<{ $variant?: "primary" | "ghost" }>`
  appearance: none;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .04s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
  outline: none;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
        background: ${theme.colors.primary};
        color: #fff;
        box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.06);
        &:hover { filter: brightness(0.97); }
        &:active { transform: translateY(1px); }
        &:focus-visible { box-shadow: 0 0 0 3px rgba(36,86,232,.25); }
      `
      : `
        background: ${theme.colors.cardBg};
        color: #333;
        border-color: ${theme.colors.border};
        &:hover { background: #f6f8fb; }
        &:active { transform: translateY(1px); }
        &:focus-visible { box-shadow: 0 0 0 3px rgba(0,0,0,.06); }
      `
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ActRow = styled.div`display:flex; gap:8px; align-items:center;`;

export const Wrap = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;
export const Header = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
export const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;
export const Sub = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  margin-left: 8px;
`;
export const Search = styled.div`
  input {
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    min-width: 240px;
    background: ${({ theme }) => theme.colors.cardBg};
  }
`;
export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
export const KPI = styled.div`
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cardBg};
  h4 {
    margin: 0 0 6px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }
  strong {
    font-size: 20px;
  }
`;
export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 8px;
`;
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;

  th, td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }
  th {
    background: ${({ theme }) => theme.colors.bg};
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }
  tr:hover td {
    background: #f9fbff;
  }
`;
export const Badge = styled.span<{ tone?: "blue" | "green" | "orange" | "red" }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  background: ${({ tone, theme }) =>
    tone === "blue" ? "#e8f0ff"
    : tone === "green" ? "#e7f7ee"
    : tone === "orange" ? "#fff3e6"
    : tone === "red" ? "#ffe8ea"
    : theme.colors.bg};
  color: ${({ tone }) =>
    tone === "blue" ? "#2456e8"
    : tone === "green" ? "#0f8a4b"
    : tone === "orange" ? "#c45a00"
    : tone === "red" ? "#c2152a"
    : "#333"};
`;
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
`;
export const ModalBox = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.35);
  padding: 24px 24px 20px;
`;
export const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }
  input {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.bg};
  }
`;
export const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;