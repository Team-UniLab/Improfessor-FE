'use client';

import Header from "@/components/Header";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useProblem from "@/hooks/useProblem";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import { axiosInstance } from "@/lib/axios";
import styled from "styled-components";
import UploadIcon from "@/assets/icons/upload.svg";
import CheckIcon from "@/assets/icons/check.svg";

const GeneratePage=() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const { user, isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const conceptFileRef = useRef<HTMLInputElement>(null);
  const formatFileRef = useRef<HTMLInputElement>(null);
  const [conceptFileName, setConceptFileName] = useState<string>('');
  const [formatFileName, setFormatFileName] = useState<string>('');

  const { useGenerateProblem } = useProblem();
  const generateProblemMutation = useGenerateProblem();
  const handleConceptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        showAlert('파일 크기가 15MB를 초과합니다. 더 작은 파일을 선택해주세요.');
        e.target.value = ''; // 파일 선택 초기화
        setConceptFileName('');
        return;
      }
      setConceptFileName(file.name);
    }
  };

  const handleFormatFileClick = (e: React.MouseEvent) => {
    if (!conceptFileRef.current?.files?.length) {
      e.preventDefault();
      showAlert('수업 자료를 먼저 업로드해 주세요.');
      return;
    }
  };

  const handleFormatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        showAlert('파일 크기가 15MB를 초과합니다. 더 작은 파일을 선택해주세요.');
        e.target.value = ''; // 파일 선택 초기화
        setFormatFileName('');
        return;
      }
      setFormatFileName(file.name);
    }
  };

  const handleGenerate = async () => {
    // 로그인 체크
    if (!isAuthenticated) {
      showAlert('로그인이 필요합니다.');
      return;
    }

    // freeCount 체크
    if (!user || user.freeCount <= 0) {
      showAlert('무료 생성 횟수가 부족합니다. 마이페이지에서 확인해주세요.');
      return;
    }

    const conceptFiles = conceptFileRef.current?.files;
    if (!conceptFiles || conceptFiles.length === 0) {
      showAlert('수업 자료를 업로드해주세요.');
      return;
    }

    // 파일 크기 재체크
    const maxSize = 15 * 1024 * 1024; // 15MB
    for (let i = 0; i < conceptFiles.length; i++) {
      if (conceptFiles[i].size > maxSize) {
        showAlert(`수업 자료 파일 "${conceptFiles[i].name}"의 크기가 15MB를 초과합니다.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const formatFiles = formatFileRef.current?.files;
      
      // 족보 파일 크기 체크
      if (formatFiles) {
        for (let i = 0; i < formatFiles.length; i++) {
          if (formatFiles[i].size > maxSize) {
            showAlert(`족보 파일 "${formatFiles[i].name}"의 크기가 15MB를 초과합니다.`);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await generateProblemMutation.mutateAsync({
        conceptFiles: Array.from(conceptFiles),
        formatFiles: formatFiles ? Array.from(formatFiles) : undefined,
      });

      const state = {
        problems: response.data.problems
      };
      router.push(`/result?state=${encodeURIComponent(JSON.stringify(state))}`);
    } catch (error) {
      console.error('문제 생성 실패:', error);
      showAlert('문제 생성에 실패했습니다.');
      setIsLoading(false);
    }
  };


  return (
    <Wrapper>
      <Header />

      <ContentWrapper>
        <PageTitle>내가 교수님</PageTitle>
        <SubText>자료 업로드 후 문제 생성하기 버튼을 눌러주세요</SubText>

        {/* 수업 자료 업로드 */}
        <Card>
          <CardTitle>수업 자료 업로드 (필수)</CardTitle>
          <CardDesc>문제를 만들어 드릴까요? 개념 학습 자료를 업로드해주세요</CardDesc>

          <UploadBox>
            <HiddenInput
              type="file"
              accept=".pdf"
              ref={conceptFileRef}
              onChange={handleConceptFileChange}
            />

            <UploadLabel onClick={() => conceptFileRef.current?.click()}>
              <UploadIcon />
              <UploadText>{conceptFileName || "파일 선택하기 (필수)"}</UploadText>
              <UploadSub>
                <UploadGroup>
                PDF
                <CheckIcon />
                </UploadGroup>
                <UploadGroup>
                PPT 
                <CheckIcon />
                </UploadGroup>
                각 15MB 이하
              </UploadSub>
            </UploadLabel>
          </UploadBox>
        </Card>

        {/* 족보 업로드 */}
        <Card>
          <CardTitle>족보 올리기 (선택)</CardTitle>
          <CardDesc>유사한 스타일로 만들어 드릴까요? 원하는 문제 유형 자료를 업로드 해주세요</CardDesc>

          <UploadBox>
            <HiddenInput
              type="file"
              accept=".pdf"
              ref={formatFileRef}
              onChange={handleFormatFileChange}
            />

            <UploadLabel onClick={handleFormatFileClick}>
              <UploadIcon>
                <path d="M24 32V16M16 24L24 16L32 24" stroke="#777" strokeWidth="2" />
                <path d="M8 32H40" stroke="#777" strokeWidth="2" />
              </UploadIcon>
              <UploadText>{formatFileName || "파일 선택하기 (선택)"}</UploadText>
              <UploadSub>
                <UploadGroup>
                PDF
                <CheckIcon />
                </UploadGroup>
                <UploadGroup>
                PPT 
                <CheckIcon />
                </UploadGroup>
                각 15MB 이하
              </UploadSub>
            </UploadLabel>
          </UploadBox>
        </Card>
        <GenerateButton onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? "문제 생성 중..." : "문제 생성하기"}
        </GenerateButton>
      </ContentWrapper>
    </Wrapper>
  );
};

export default GeneratePage;

/* ============================
      styled-components
============================ */

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--gra_navy, linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%));
  color: white;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 77px 120px 180px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 50px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
`;

const SubText = styled.p`
  text-align: center;
  color: white;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 71px;
`;

const Card = styled.div`
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.10);
  padding: 30px 50px;
  margin-bottom: 71px;
  min-width: 575px;
  max-width: 1100px;
  width: 90vw;
`;

const CardTitle = styled.h2`
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 10px;
`;

const CardDesc = styled.p`
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 43px;
`;

const UploadBox = styled.div`
  border-radius: 20px;
  border: 1px solid var(--white-50, rgba(255, 255, 255, 0.50));
  background: rgba(255, 255, 255, 0.10);
  padding: 30px;
  text-align: center;
  min-width: 475px;
  max-width: 1000px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadLabel = styled.div`
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;


const UploadText = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const UploadSub = styled.div`
  font-size: 12px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UploadGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`

const GenerateButton = styled.button`
  width: 50vw;
  max-width: 616px;
  height: 102px;
  padding: 30px;
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  margin-top: 36px;
  border-radius: 20px;
  background: var(--dusty-blue-80, rgba(72, 86, 105, 0.80));
  box-shadow: 0 0 20px 0 #20212B;
  &:disabled {
    cursor: not-allowed;
  }
`;