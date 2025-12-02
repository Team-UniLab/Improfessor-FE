'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import styled from "styled-components";
import KakaoImg from "@/assets/buttons/kakao.svg";
import Back from "@/assets/buttons/back.svg";

const LoginPage=() => {
  const router = useRouter();
  const { useLogin } = useAuth();
  const login = useLogin();
  const { showAlert } = useAlert();
  const [kakaoUrl, setKakaoUrl] = useState<string>("");

  // 로컬 개발환경에서 리다이렉트 URI를 localhost로 설정
useEffect(() => {
  if (typeof window !== "undefined") {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const baseKakaoUrl = `${API_URL}/oauth2/authorization/kakao`;
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const url = new URL(baseKakaoUrl);

    const redirectUri = isLocal
        ? process.env.NEXT_PUBLIC_REDIRECT_LOCAL
        : process.env.NEXT_PUBLIC_REDIRECT_PROD;

      url.searchParams.set("redirect_uri", redirectUri || "");
      setKakaoUrl(url.toString());
  }
}, []);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      router.push("/generate");
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

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
      <BackButton href="/">
      <Back width={40} height={40} />
        </BackButton>

      <CenterContainer>
        <Panel>
          <Title>로그인</Title>

          {/* ID */}
          <FieldRow>
            <Label>Email</Label>
            <InputBox
              id="email"
              value={formData.email}
              placeholder="이메일을 입력하세요"
              onChange={handleChange}
            />
          </FieldRow>

          {/* PW */}
          <FieldRow>
            <Label>PW</Label>
            <InputBox
              type="password"
              id="password"
              value={formData.password}
              placeholder="비밀번호를 입력하세요"
              onChange={handleChange}
            />
          </FieldRow>

          <LoginButton onClick={handleSubmit}>
            로그인
          </LoginButton>

          <Divider><span>or</span></Divider>

          <KakaoButton href={kakaoUrl}>
            <KakaoImg />
          </KakaoButton>

          <SignupText>
            <Link href="/signup">이메일로 회원가입</Link>
          </SignupText>
        </Panel>
      </CenterContainer>
      </Content>
    </Wrapper>
  );
}
export default LoginPage;

const Wrapper = styled.div`
  min-height: 100vh;
  position: relative;
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
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
  z-index: 2;
  `;

const BackButton = styled(Link)`
  position: absolute;
  margin-top: 140px;
  margin-left: 120px;
  z-index: 10;
  color: white;
  &:hover {
    opacity: 1;
  }
`;

const CenterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled.div`
  color: white;
  //width: 420px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.div`
  color: #FFF;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 32px;
  margin-left: 70px;
`;

const FieldRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

const Label = styled.div`
  width: 45px;
  font-size: 18px;
  font-style: normal; 
  font-weight: 400;
  line-height: normal;
  text-align: right;
  padding-right: 25px;
  margin-right: 25px;
`;

const InputBox = styled.input`
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.60);
  background: rgba(255, 255, 255, 0.30);
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  width: 328px;
  height: 41px;
  &::placeholder {
    color: white;
  }
  &:focus {
    outline: none;
    border-color: white;
  }
`;

const LoginButton = styled.button`
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  width: 328px;
  height: 41px;
  padding: 0 24.957px;
  border-radius: 10px;
  background: var(--black-100, linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), 
  linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #000);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.70);
  margin-left: 70px;
`;

const Divider = styled.div`
  margin-left: 70px;
  display: flex;
  align-items: center;
  color: white;
  opacity: 0.7;
  font-size: 14px;
  margin-top: 35px;

  &::before, &::after {
    content: "";
    flex: 1;
    background: rgba(255,255,255,0.4);
    height: 1px;
  }

  span {
    margin: 0 12px;
  }
`;

const KakaoButton = styled.a`
  margin-left: 70px;
  margin-top: 24px;
`;

const SignupText = styled.div`
  margin-top: 46px;
  text-align: center;
  margin-left: 75px;
  a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
`;
