'use client';

import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import UniversitySearchModal from "@/components/UniversitySearchModal";
import MajorSearchModal from "@/components/MajorSearchModal";
import styled from "styled-components";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, error, isAuthenticated } = useUser();
  const { useUpdateUser, useDeleteUser } = useAuth();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { showAlert, showConfirm } = useAlert();

  // 로컬 상태 (수정 가능한 필드들)
  const [university, setUniversity] = useState<string | null>(null);
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [inputReferral, setInputReferral] = useState("");
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);

  // // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return null;
  // }

   if (isLoading) {
    return (
      <Wrapper>
        <Header />
        <Center>로딩 중...</Center>
      </Wrapper>
    );
  }

  if (error || !user) {
    return (
      <Wrapper>
        <Header />
        <Center>사용자 정보를 불러오는데 실패했습니다.</Center>
      </Wrapper>
    );
  }
  // 사용자 정보가 로드되면 로컬 상태 업데이트 (초기화 시에만)
  const displayUniversity = university !== null ? university : (user.university || "");
  const displayMajor = major !== null ? major : (user.major || "");

  // 변경사항이 있는지 확인
  const hasChanges = () => {
    const universityChanged = university !== null && university !== (user.university || "");
    const majorChanged = major !== null && major !== (user.major || "");
    
    return universityChanged || majorChanged;
  };

  const handleUpdateUser = async () => {
    try {
      const updateData: {
        id: number;
        university?: string | null;
        major?: string | null;
        recommendNickname?: string;
      } = {
        id: parseInt(user.userId)
      };
      
      // 대학교 처리: 수정된 값이 있으면 수정값, 없으면 기존값 유지
      if (university !== null) {
        updateData.university = university;
      } else if (user.university) {
        updateData.university = user.university;
      }
      
      // 학과 처리: 수정된 값이 있으면 수정값, 없으면 기존값 유지
      if (major !== null) {
        updateData.major = major;
      } else if (user.major) {
        updateData.major = user.major;
      }

      await updateUser.mutateAsync(updateData);
      showAlert("계정 정보가 수정되었습니다.");
      // 수정 후 로컬 상태 초기화
      setUniversity(null);
      setMajor(null);
    } catch (error) {
      console.error('계정 수정 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("계정 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleDeleteUser = () => {
    showConfirm(
      '계정을 삭제하시겠습니까?',
      '현재 해당 서비스는 초기 베타 버전으로 올해 10월 정식 서비스 런칭이 예정되어 있습니다.\n\n모든 데이터는 계정 삭제 후 30일 안에 영구적으로 삭제됩니다.',
      async () => {
      try {
        await deleteUser.mutateAsync(user.userId);
        showAlert("계정이 삭제되었습니다.");
        router.push("/");
      } catch (error) {
        console.error('계정 탈퇴 실패:', error);
        if (error instanceof AxiosError && error.response?.data) {
          const errorResponse = error.response.data as ApiResponse<null>;
          showAlert(errorResponse.message);
        } else {
          showAlert("계정 탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
      }
    });
  };

  const handleUniversitySelect = (university: string, universityId: string) => {
    setUniversity(university);
    setUniversityId(universityId);
  };

  const handleMajorSelect = (major: string) => {
    setMajor(major);
  };

  const handleReferralSubmit = async () => {
    if (!inputReferral.trim()) {
      showAlert("추천인 코드를 입력해주세요.");
      return;
    }

    try {
      const updateData: {
        id: number;
        recommendNickname: string;
        university?: string;
        major?: string;
      } = {
        id: parseInt(user.userId),
        recommendNickname: inputReferral.trim()
      };

      // 기존 학교, 학과 값이 있으면 함께 전송
      if (user.university) {
        updateData.university = user.university;
      }
      if (user.major) {
        updateData.major = user.major;
      }

      await updateUser.mutateAsync(updateData);
      showAlert("추천인 코드가 입력되었습니다. 문제 생성 횟수가 1회 추가됩니다.");
      setInputReferral("");
    } catch (error) {
      console.error('추천인 코드 입력 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("추천인 코드 입력에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };
return (
    <Wrapper>
      <Header />
      <Content>
        <Title>마이페이지</Title>
        <SectionTitle>내 계정</SectionTitle>

        <FormGroup>
          <Label>사용자 이메일</Label>
          <Input disabled value={user.email} />
        </FormGroup>

        <FormGroup>
          <Label>사용자 닉네임</Label>
          <Input disabled value={user.nickname} />
        </FormGroup>

        <FormGroup>
          <Label>대학교</Label>
          <Input
            value={displayUniversity}
            onChange={(e) => setUniversity(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>학과</Label>
          <Input
            value={displayMajor}
            onChange={(e) => setMajor(e.target.value)}
          />
        </FormGroup>

        <PrimaryButton
          disabled={updateUser.isPending || !hasChanges()}
          onClick={handleUpdateUser}
        >
          {updateUser.isPending ? "수정 중..." : "수정하기"}
        </PrimaryButton>
        <SectionLine />

        <PromoTitle>프로모션</PromoTitle>

        <PromoText>
          친구를 추천하여 최대 99회의 무료 생성 횟수를 받으세요!<br />
          친구가 내 추천인 코드를 입력하면 친구는 3회, 나는 3회의 무료 생성 횟수를 받습니다.<br />
          추천인 코드 입력은 1회만 가능하고, 추천받는 것은 최대 33회까지 가능합니다.
        </PromoText>
        <Row>
        <PromoBox>
          <PromoLabel>내 추천인 코드 :</PromoLabel>
          <PromoCode>{user.nickname}</PromoCode>
        </PromoBox>

        <Column>
          <PromoLabel2>추천인 코드 입력</PromoLabel2>
            <Group>
            <Input
              value={inputReferral}
              onChange={(e) => setInputReferral(e.target.value)}
              placeholder="추천인 코드를 입력하세요"
            />
            <SmallButton
              disabled={!inputReferral.trim()}
              onClick={handleReferralSubmit}
            >
              입력
            </SmallButton>
          </Group>
          <SmallText>문제 생성 횟수가 1회 추가됩니다. (1회만 가능)</SmallText>
        </Column>
        </Row>

        <DangerButton onClick={handleDeleteUser}>계정 탈퇴</DangerButton>
      </Content>

      <UniversitySearchModal
        isOpen={isUniversityModalOpen}
        onClose={() => setIsUniversityModalOpen(false)}
        onSelect={setUniversity}
      />

      <MajorSearchModal
        isOpen={isMajorModalOpen}
        onClose={() => setIsMajorModalOpen(false)}
        onSelect={setMajor}
        selectedUniversity={displayUniversity}
        selectedUniversityId={universityId || ""}
      />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--gra_navy, linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%));
  padding-top: 24px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 77px 120px 180px 120px;
  color: white;
`;

const Center = styled.div`
  text-align: center;
  margin-top: 180px;
  color: white;
`;

const Title = styled.h1`
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 77px;
`;

const SectionTitle = styled.h2`
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 50px;
`;

const SectionLine = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.5);
  margin-top: 97px;
  margin-bottom: 85px;
`;

const FormGroup = styled.div`
  margin-bottom: 49px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-left: 40px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  width: 98px;
`;

const Input = styled.input`
  width: 328px;
  height: 41px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.60);
  background: var(--white-30, rgba(255, 255, 255, 0.30));
  &:disabled {
    cursor: not-allowed;
  }
  margin-right: 25px;
`;

const PrimaryButton = styled.button`
  width: 328px;
  height: 41px;
  padding: 0 24.957px;
  border-radius: 10px;
  background: var(--dusty-blue-80, rgba(72, 86, 105, 0.80));
  box-shadow: 0 0 4px 0 rgba(255, 255, 255, 0.50);
  font-family: "Apple SD Gothic Neo";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  margin-left: 158px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`;

const PromoTitle = styled.h2`
font-size: 30px;
font-style: normal;
font-weight: 600;
line-height: 140%;
margin-bottom: 17px;
`;


const PromoText = styled.p`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 70px;
`;

const PromoBox = styled.div`
  border-radius: 10px;
  border: 1px solid var(--white-100, #FFF);
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;
  height: 81px;
  justify-content: center;
  margin-left: 20px;
`;

const PromoLabel = styled.span`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const PromoLabel2 = styled.span`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 20px;
`;
const PromoCode = styled.span`
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; 
  color: white;
`;

const Row = styled.div`
  display: flex;
  gap: 100px;
  align-items: center;
  justify-content: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  `;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  `;

const SmallButton = styled.button`
  height: 41px;
  padding: 0 24px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.30);
  color: white;
  cursor: pointer;
  margin-left: 17px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const SmallText = styled.div`;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-align: right;
  margin-right: 118px;
`;

const DangerButton = styled.button`
  width: 328px;
  height: 41px;
  padding: 0 24.957px;
  border-radius: 10px;
  background: var(--black-100, linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #000);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.70);
  margin: 140px auto 0 auto;  
  display: block;
`;
