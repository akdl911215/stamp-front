import styled from "styled-components";
import GlobalStyle from "../shared/styles/GlobalStyle";

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Customer Admin</Title>
        <p>React + Vite + TypeScript + Styled Components</p>
      </Container>
    </>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #0077ff;
  font-size: 2rem;
`;
