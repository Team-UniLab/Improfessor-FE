import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import CloseIcon from '@/assets/buttons/close.svg';


interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onCancel}>
          <CloseIcon />
        </CloseButton>

        <Title>{title}</Title>
        {description && <Description>{description}</Description>}

        <ButtonWrapper>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>,
    document.body
  );
}

/* ---------------- Styled Components ---------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContainer = styled.div`
  position: relative;
  color: #fff;
  padding: 40px;
  width: 380px;
  border-radius: 20px;
  text-align: center;
  background: var(--black-85, rgba(0, 0, 0, 0.85));
  box-shadow: 0 0 4px 0 rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(2px);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 22px;
  margin-top: 5px;
  color: #bbb;
  background: none;
  border: none;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 19px;
`;

const Description = styled.div`
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 30px;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.30);
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background: #555;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: #6366f1; 
  color: #fff;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }
`;
