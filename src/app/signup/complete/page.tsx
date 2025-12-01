'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";

const SignupCompletePage=() => {
 const params = useSearchParams();
 const name = params.get("name");
  return (
    <Wrapper>
       <BackgroundVideo
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
      </BackgroundVideo>
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
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%);
      z-index: 1; /* 내용 위에 올려 덮는 레이어 */
    }
`;

  const BackgroundVideo = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0; /* 가장 뒤 */
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
`;

const SubText = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 109px;
`;

const LoginButton = styled(Link)`
  display: inline-block;
  color: white;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-decoration: underline;
`;
