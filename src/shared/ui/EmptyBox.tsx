import styled from "styled-components";

export function EmptyBox({ title, description, children }: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Wrap>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </Wrap>
  );
}

const Wrap = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;

  h3 {
    margin-bottom: 8px;
    font-size: 20px;
  }

    p {
      margin-bottom: 16px;
      font-size: 14px;
      color: #888;
    }
`;
