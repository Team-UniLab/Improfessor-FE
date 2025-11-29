'use client';

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import styled from "styled-components";

 const Home=() => {
  const { isAuthenticated } = useUser();

  return (
    <Wrapper>
      <Card>
        <Title>내가 교수님</Title>

        <Subtitle>
          PDF 파일을 업로드하면 AI가 자동으로 학습문제를 생성해주는 스마트한 교육 플랫폼
        </Subtitle>

        {isAuthenticated ? (
          <Button href="/generate">시작하기</Button>
        ) : (
          <>
            <Button href="/login">시작하기</Button>
            <BottomText>
              회원이 아니신가요?
              <BottomLink href="/signup">회원가입</BottomLink>
            </BottomText>
          </>
        )}
      </Card>
    </Wrapper>
  );
}
export default Home;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background:
    linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%),
    url("/background.gif") center/cover no-repeat;
`;

const Card = styled.div`
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.20);
  text-align: center;
  width: 769px;
  height: 453px;
`;

const Title = styled.div`
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.70);
  font-family: Pretendard;
  font-size: 100px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 44px;
`;

const Subtitle = styled.div`
  color: var(--white-100, #FFF);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.70);
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 28px */
  margin-top: 14px;
`;

const Button = styled(Link)`
  display: inline-block;
  color: white;
  width: 130px;
  height: 64px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.70);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
  margin-bottom: 62px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.70);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  margin-top: 58px;
  padding-top: 20px;
`;

const BottomText = styled.div`
  color: var(--white-100, #FFF);
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.30);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const BottomLink = styled(Link)`
  margin-left: 4px;
  text-decoration: underline;
  color: #FFF;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-left: 30px;
  &:hover {
    color: white;
  }
`;
