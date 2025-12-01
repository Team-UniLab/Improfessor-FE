'use client';

import { useState } from "react";
import React from "react";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import useNotice from "@/hooks/useNotice";
//import { useRouter } from "next/navigation";
import styled from "styled-components";
import ArrowIcon from "@/assets/icons/vector.svg";

export default function NoticePage() {
  //const router = useRouter();
  const { useNoticeList } = useNotice();
  const { data: noticeResponse, isLoading } = useNoticeList();
  const [openId, setOpenId] = useState<number | null>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const notices = noticeResponse?.data || [];
  const totalPages = Math.ceil(notices.length / itemsPerPage);
  // 현재 페이지에 해당하는 공지사항만 필터링
  const currentNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <div>로딩 중...</div>;
  }
    const toggleOpen = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

 return (
    <Wrapper>
      <Header />
      <Content>
        <Card>
          <Title>공지사항</Title>
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <Th width="80">No</Th>
                  <Th>제목</Th>
                  <Th width="140">작성일</Th>
                  <Th width="5"></Th>
                </tr>
              </thead>

              <tbody>
  {currentNotices.map((notice) => (
    <React.Fragment key={notice.noticeId}>
      
      <Tr isOpen={openId === notice.noticeId}>
        <Td>{notice.noticeId}</Td>

        <Td>
          <FlexRow>{notice.title}</FlexRow>
        </Td>

        <Td>{new Date(notice.createdAt).toLocaleDateString()}</Td>

        <ArrowTd>
          <ArrowBtn
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen(notice.noticeId);
            }}
          >
            <ArrowIcon
              style={{
                transform:
                  openId === notice.noticeId ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.2s",
              }}
            />
          </ArrowBtn>
        </ArrowTd>
      </Tr>
      {openId === notice.noticeId && (
        <TrContent>
          <TdContent colSpan={4}>
            {notice.content}
          </TdContent>
        </TrContent>
      )}
    </React.Fragment>
  ))}
</tbody>
            </StyledTable>
          </TableWrapper>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--gra_navy, linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%));
`;

const Content = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 77px 120px 180px 120px;
`;

const Card = styled.div`

`;

const Title = styled.h1`
  color: white;
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 43px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
  thead{
    background: rgba(255, 255, 255, 0.1);
    height: 48px;
    padding: 30px 20px;
  }
`;

const Th = styled.th<{ width?: string }>`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; 
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  width: ${(props) => props.width || "auto"};
`;

const Td = styled.td`
  padding: 30px 20px;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-align: center;
`;

const Tr = styled.tr<{ isOpen: boolean }>`
  cursor: pointer;
  text-align: center;
  border-bottom: ${(p) =>
    p.isOpen ? "none" : "1px solid var(--white-50, rgba(255, 255, 255, 0.50))"};
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const ArrowBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
`;

const TrContent = styled.tr`
`;

const TdContent = styled.td`
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  line-height: 140%;
  padding-bottom: 30px;
  text-align: center;
  width: 484px;
  border-bottom: 1px solid var(--white-50, rgba(255, 255, 255, 0.50));
`;

const ArrowTd = styled.td`
  width: 40px;
  text-align: center;
  padding: 0;
`;
