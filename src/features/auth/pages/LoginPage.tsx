// src/features/auth/pages/LoginPage.tsx
import styled from "styled-components";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <Wrap>
      <Header>
        <Logo>🏷️</Logo>
        <Title>관리자 로그인</Title>
        <Sub>소속 고객 관리 시스템</Sub>
      </Header>
      <LoginForm />
      <Footer>
        <a href="#">비밀번호 재설정</a>
      </Footer>
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 100vh; display: grid; place-items: center; padding: 24px;
  background: linear-gradient(180deg, #f9fbff, #f0f4ff);
`;
const Header = styled.div`text-align: center; margin-bottom: 12px;`;
const Logo = styled.div`font-size: 40px;`;
const Title = styled.h1`margin: 8px 0 4px; font-size: 22px;`;
const Sub = styled.p`margin: 0; color: ${({ theme }) => theme.colors.muted};`;
const Footer = styled.div`margin-top: 12px; text-align: center;`;
