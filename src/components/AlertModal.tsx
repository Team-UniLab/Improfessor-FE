import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from "styled-components";
import CloseIcon from '@/assets/buttons/close.svg';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
   <Overlay>
      <Background onClick={onClose} />

      <ModalBox>
        <Row>
        <Title>알림</Title>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        </Row>
        <Message>{message}</Message>

        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalBox>
    </Overlay>,
    document.body
  );
}
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
`;

const ModalBox = styled.div`
  //position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: var(--black-85, rgba(0, 0, 0, 0.85));
  box-shadow: 0 0 4px 0 rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(2px);
  padding: 40px;
  width: 380px;
  height: 220px;
  z-index: 10;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 19px;
  `

const CloseButton = styled.button`
  color: white;
  cursor: pointer;
  background: none;
  border: none;
  width: 16.076px;
  height: 15.987px;
  margin-left: 240px;
  margin-top: 5px;
`;

const Title = styled.h2`
  color: white;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-align: left;
  width: 40px;
`;

const Message = styled.p`
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 30px;
  text-align: left;
`;

const ConfirmButton = styled.button`
  width: 76px;
  height: 41px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.30);
  color: white;
  padding: 0 24px;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%
  cursor: pointer;
  margin: 0 auto;
  border: none;
`;
