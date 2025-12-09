import styled from "styled-components";
import ArrowDoubleLeft from "@/assets/icons/doubleleftarrow.svg";
import ArrowDoubleRight from "@/assets/icons/doubleright.svg";
import ArrowLeft from "@/assets/icons/leftarrow.svg";
import ArrowRight from "@/assets/icons/rightarrow.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageSize = 10;
  const startPage = Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, totalPages);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <Wrapper>
      <NavButton disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        <ArrowDoubleLeft />
      </NavButton>

      <NavButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <ArrowLeft />
      </NavButton>

      <Pages>
      {pages.map((page) => (
        <Page key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
          {page}
        </Page>
          ))}
        </Pages>

      <NavButton disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <ArrowRight />
      </NavButton>

      <NavButton disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
        <ArrowDoubleRight />
      </NavButton>

    </Wrapper>
  );
}


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  //align-items: center;
  gap: 25px;
  margin-top: 77px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  transition: 0.2s;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Pages = styled.div`
  display: flex;
  gap: 25px;
  margin-left: 25px;
  margin-right: 25px;
`;

const Page = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-top: 2px;
  font-weight: ${(p) => (p.active ? 700 : 400)};
  color: ${(p) =>
    p.active ? "white" : "rgba(255, 255, 255, 0.5)"};
  transition: 0.2s;
   border-bottom: ${(p) =>
    p.active ? "2px solid rgba(255, 255, 255, 0.9)" : "2px solid transparent"};
`;
