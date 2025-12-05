'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import { Problem } from '@/types/problem';
import useProblem from '@/hooks/useProblem';
import styled from 'styled-components';

const ResultPage =()=> {
  const router = useRouter();
  const { downloadProblemPDF } = useProblem();
  
  const [isLoading, setIsLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

   useEffect(() => {
    // 🔥 localStorage에서 결과 불러오기
    const stored = localStorage.getItem("generateResult");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProblems(parsed.problems);
      } catch (err) {
        console.error("JSON parse error:", err);
        router.push('/generate');
      }
    } else {
      router.push('/generate');
    }
  }, [router]);

  const handleDownload = async () => {
    if (!problems.length) return;

    setIsLoading(true);
    try {
      await downloadProblemPDF(problems);
    } catch (error) {
      alert(`PDF 다운로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header />

      <ContentWrapper>
        <ResultCard>
          <TopBar>
            <Title>생성된 문제</Title>

            <PDFButton onClick={handleDownload} disabled={isLoading}>
              {isLoading ? "다운로드 중..." : "PDF 다운로드"}
            </PDFButton>
          </TopBar>

          <ProblemsWrapper>
            {problems.map((problem, index) => (
              <ProblemCard key={index}>
                <ProblemTitle>문제 {index + 1}</ProblemTitle>

                <Section>
                  <SectionLabel>문제 내용</SectionLabel>
                  <SectionText>{problem.content}</SectionText>
                </Section>

                {problem.description && (
                  <Section>
                    <SectionLabel>설명</SectionLabel>
                    <SectionText>{problem.description}</SectionText>
                  </Section>
                )}

                <Section>
                  <SectionLabel>정답</SectionLabel>
                  <SectionText>{problem.answer}</SectionText>
                </Section>
              </ProblemCard>
            ))}
          </ProblemsWrapper>
        </ResultCard>
        <BottomButton onClick={() => router.push('/generate')}>
            새로운 문제 생성하기
          </BottomButton>
      </ContentWrapper>
    </Wrapper>
  );
}
export default ResultPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--gra_navy, linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%));
  padding-top: 24px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 77px 120px 180px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
    @media (max-width: 768px) {
    padding: 53px 12.5px 120px 12.5px;
  }
`;

const ResultCard = styled.div`
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.10);
  max-width: 1100px;
  padding: 30px 50px;
  color: white;
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 43px;
    @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 600;
  color: white;
  @media (max-width: 768px) {
     font-size: 20px;
  }
`;

const PDFButton = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.80);
  font-size: 20px;
  font-weight: 600;
  color: #405348;
  cursor: pointer;
    @media (max-width: 768px) {
     font-size: 14px;
  }

  &:disabled {cursor: not-allowed; }
`;

const ProblemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 43px;
  @media (max-width: 768px) {
    gap: 30px;
  }
`;

const ProblemCard = styled.div`
  padding: 30px;
  border-radius: 10px;
  border: 1px solid var(--white-50, rgba(255, 255, 255, 0.50));
  background: rgba(255, 255, 255, 0.10);
  max-width: 1008px;
`;

const ProblemTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 30px;
  @media (max-width: 768px) {
     font-size: 18px;
  }
`;

const Section = styled.div`
   margin-bottom: 24px;
`;

const SectionLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  @media (max-width: 768px) {
     font-size: 16px;
  }
`;

const SectionText = styled.div`
  color: rgba(255,255,255,0.9);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  white-space: pre-wrap;
  @media (max-width: 768px) {
     font-size: 14px;
  }
`;

const BottomButton = styled.button`
  margin-top: 77px;
  display: block;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-decoration: underline;
  cursor: pointer;
  @media (max-width: 768px) {
     font-size: 14px;
  }
`;
