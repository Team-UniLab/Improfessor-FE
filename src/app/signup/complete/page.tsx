'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";

const SignupCompletePage=() => {
 const params = useSearchParams();
 const name = params.get("name");
  return (
    <Wrapper>
      <Content>
        <Title>
          안녕하세요, <span>{name}</span> 님
        </Title>

        <SubText>
          회원가입이 완료되었습니다.<br />
          로그인 후 문제를 생성해보세요.
        </SubText>

        <LoginButton href="/login">로그인</LoginButton>
      </Content>
    </Wrapper>
  );
}
export default SignupCompletePage

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 24px;
  background: var(--gra_navy, linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%));
  @media (max-width: 768px) {
     align-items: flex-start;
     padding-top: 224px;
  }
`;

const Content = styled.div`
  position: relative;
  text-align: center;
  color: white;
  z-index: 2;
`;

const Title = styled.h1`
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.70);
  font-size: 80px;
  font-style: normal;
  font-weight: 600; 
  line-height: 140%;
  margin-bottom: 34px;
  @media (max-width: 768px) {
    font-size: 52px;
    margin-bottom: 73px;
  }
`;

const SubText = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 109px;
  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: 400;

  }
`;

const LoginButton = styled(Link)`
  display: inline-block;
  color: white;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-decoration: underline;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
