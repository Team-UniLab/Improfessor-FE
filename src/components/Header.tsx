'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/context/UserContext';
import styled from "styled-components";
import BellIcon from "@/assets/icons/bell.svg";
import UserIcon from "@/assets/icons/user.svg";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { useLogout } = useAuth();
  const logoutMutation = useLogout();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // 디버깅: 로그인 상태 확인
  useEffect(() => {
    console.log('[Header] Auth state:', { isAuthenticated, user, userLoading });
  }, [isAuthenticated, user, userLoading]);

  // 초기 토큰 설정
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // axiosInstance의 Authorization 헤더 설정은 lib/axios.ts에서 처리
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 토큰은 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsProfileOpen(false);
      router.push('/');
    }
  };
  return (
    <Wrapper>
      <InnerContainer>
        {/* 로고 */}
        <Logo href="/generate">내가 교수님</Logo>

        <RightBox>
          {/* 공지사항 아이콘 */}
          <IconButton href="/notice">
            <BellIcon />
          </IconButton>

          {/* 프로필 */}
          {isAuthenticated ? (
            <ProfileWrapper>
              <ProfileButton onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <Nickname>{user?.nickname ?? '사용자'}</Nickname>
                <UserIcon />
              </ProfileButton>

              {isProfileOpen && (
                <Dropdown>
                  <DropdownItem>
                    <EmailText>{user?.email}</EmailText>
                    <SmallText>무료 생성: {user?.freeCount}회</SmallText>
                  </DropdownItem>

                  <DropdownLink href="/mypage" onClick={() => setIsProfileOpen(false)}>
                    마이페이지
                  </DropdownLink>

                  <DropdownButton onClick={handleLogout}>
                    {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                  </DropdownButton>
                </Dropdown>
              )}
            </ProfileWrapper>
          ) : (
            <LoginGroup>
              <LoginLink href="/login">로그인</LoginLink>
              <Divider>|</Divider>
              <LoginLink href="/signup">회원가입</LoginLink>
            </LoginGroup>
          )}
        </RightBox>
      </InnerContainer>
    </Wrapper>
  );
}
const Wrapper = styled.header`
  width: 80vw;
  max-width: 1200px;
  padding: 20px 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  border-radius: 99px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.40);
  background: var(--bright-navy-4, rgba(50, 116, 239, 0.04));
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
`;

const InnerContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%
  color: white;
  text-decoration: none;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.70);
`;

const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

/* 아이콘 버튼 */
const IconButton = styled(Link)`
  color: white;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

/* 프로필 */
const ProfileWrapper = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  &:hover {
    opacity: 0.7;
  }
`;

const Nickname = styled.span`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: white;
`;

/* 드롭다운 */
const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 30px;
  min-width: 200px;
  padding: 10px 0;
  border-radius: 10px;
  background: var(--bright-navy-4, rgba(50, 116, 239, 0.04));
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  color: #ddd;
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

const EmailText = styled.div`
  font-size: 14px;
`;

const SmallText = styled.div`
  font-size: 14px;
  margin-top: 2px;
`;

const DropdownLink = styled(Link)`
  padding: 20px;
  display: block;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; 
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const DropdownButton = styled.button`
  padding: 20px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; 

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const LoginGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoginLink = styled(Link)`
  color: white;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`;

const Divider = styled.span`
  color: rgba(255, 255, 255, 0.3);
`;
