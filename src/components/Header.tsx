'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/context/UserContext';
import styled from "styled-components";

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
                  <DropdownItem disabled>
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
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-decoration: none;

  /* 글로우 효과 */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
`;

const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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

const BellIcon = styled.div`
  width: 22px;
  height: 22px;
  background: url('/icons/bell.svg') center/contain no-repeat;
`;

const UserIcon = styled.div`
  width: 22px;
  height: 22px;
  background: url('/icons/profile.svg') center/contain no-repeat;
`;

/* 프로필 */
const ProfileWrapper = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: white;
`;

/* 드롭다운 */
const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 10px;
  width: 180px;
  padding: 8px 0;

  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;

  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const DropdownItem = styled.div`
  padding: 10px 14px;
  font-size: 14px;
  color: #ddd;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const EmailText = styled.div`
  font-size: 12px;
`;

const SmallText = styled.div`
  font-size: 12px;
  margin-top: 2px;
`;

const DropdownLink = styled(Link)`
  padding: 10px 14px;
  display: block;
  font-size: 14px;
  color: white;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const DropdownButton = styled.button`
  padding: 10px 14px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: white;
  font-size: 14px;

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
