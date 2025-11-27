import styled from "styled-components";

export const Dim = styled.div<{ readonly open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  opacity: ${(p) => (p.open ? 1 : 0)};
  pointer-events: ${(p) => (p.open ? "auto" : "none")};
  transition: 0.2s ease;
`;

export const Panel = styled.div<{ readonly open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 1000px;
  max-width: 92vw;
  height: 100%;
  transform: translateX(${(p) => (p.open ? "0" : "100%")});
  transition: transform 0.25s ease;
  background: ${({ theme }) => theme.colors.cardBg};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px 18px;
  overflow: auto;
  z-index: 50;
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const Box = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.bg};
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    gap: 10px;
    padding: 6px 0;
  }
`;

export const Label = styled.span`
  width: 72px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Val = styled.span``;

export const KPI = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;

  i {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  b {
    font-size: 18px;
  }
`;

export const Tbl = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 8px 10px;
    text-align: left;
  }
`;

export const Badge = styled.span<{ tone: "blue" | "green" | "orange" | "red" }>`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: ${(p) =>
    p.tone === "blue"
      ? "#e8f0ff"
      : p.tone === "green"
      ? "#e7f7ee"
      : p.tone === "orange"
      ? "#fff3e6"
      : "#ffe8ea"};
  color: ${(p) =>
    p.tone === "blue"
      ? "#2456e8"
      : p.tone === "green"
      ? "#0f8a4b"
      : p.tone === "orange"
      ? "#c45a00"
      : "#c2152a"};
`;

export const UseButton = styled.button`
  padding: 4px 10px;
  border-radius: 999px;
  border: none;
  background: #2456e8;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

