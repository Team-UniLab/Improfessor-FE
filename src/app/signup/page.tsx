'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
//import UniversitySearchModal from "@/components/UniversitySearchModal";
//import MajorSearchModal from "@/components/MajorSearchModal";
import styled from "styled-components";
import BackIcon from "@/assets/buttons/back.svg";

  const SignupPage=()=> {
  const router = useRouter();
  const { useSendVerificationEmail, useVerifyEmail, useRegister } = useAuth();
  const sendVerification = useSendVerificationEmail();
  const verifyEmail = useVerifyEmail();
  const register = useRegister();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    university: "",
    universityId: "",
    major: "",
    referralCode: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
 // const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
 // const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);

  // 비밀번호 정규식 검증 함수
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasLetter && hasNumber && hasSpecialChar,
      hasMinLength: minLength,
      hasLetter,
      hasNumber,
      hasSpecialChar,
    };
  };

  useEffect(() => {
    if (timer === null) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 0) {
          setCanResend(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // 비밀번호 입력 시 실시간 검증
    if (id === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  // const handleUniversitySelect = (university: string, universityId: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     university,
  //     universityId
  //   }));
  // };

  // const handleMajorSelect = (major: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     major
  //   }));
  // };

  const handleSendVerification = async () => {
    if (!formData.email) {
      showAlert("이메일을 입력해주세요.");
      return;
    }

    if (!canResend) {
      showAlert(`${Math.ceil(timer! / 60)}분 ${timer! % 60}초 후에 다시 시도해주세요.`);
      return;
    }

    try {
      await sendVerification.mutateAsync({ email: formData.email });
      setTimer(180);
      setCanResend(false);
      showAlert("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      console.error('인증 코드 전송 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.verificationCode) {
      showAlert("인증 코드를 입력해주세요.");
      return;
    }

    try {
      await verifyEmail.mutateAsync({
        email: formData.email,
        code: formData.verificationCode
      });
      setIsEmailVerified(true);
      showAlert("이메일이 인증되었습니다.");
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("이메일 인증에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      showAlert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!passwordValidation.isValid) {
      showAlert("비밀번호 조건을 만족하지 않습니다.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await register.mutateAsync({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        university: formData.university,
        major: formData.major,
        recommendNickname: formData.referralCode,
        freeCount: 5,
        recommendCount: formData.referralCode ? 1 : 0
      });
      showAlert("회원가입이 완료되었습니다.");
      router.push(`/signup/complete?name=${formData.nickname}`);
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

return(
<Wrapper>
      <Content>
      <BackButton href="/">
        <BackIcon width={40} height={40} />
      </BackButton>

      <Center>
        <Card>
          <Title>회원가입</Title>

          <form onSubmit={handleSubmit}>
            {/* 이메일 */}
            <Field>
              <Label>이메일</Label>
              <Row>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isEmailVerified}
                  placeholder="이메일을 입력하세요(필수)"
                />
                <Button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={isEmailVerified}
                >
                  인증번호 전송
                </Button>
              </Row>
            </Field>

            {/* 인증코드 */}
            <Field>
              <Label>인증번호</Label>
              <Row>
                <Input
                  id="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  disabled={isEmailVerified}
                  placeholder="인증번호를 입력하세요"
                />
                <Button type="button" onClick={handleVerifyEmail}>
                  확인
                </Button>
              </Row>
            </Field>

            {/* 닉네임 */}
            <Field>
              <Label1>닉네임</Label1>
              <Column>
              <Row>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요 (필수)"
              />
              {/* <Button type="button">
                  중복 확인
                </Button> */}
              </Row>
              <Text>최소 4~8자, 한영 문자, 숫자 포함</Text>
              </Column>
              
            </Field>

            {/* 비밀번호 */}
            <Field>
              <Label1>비밀번호</Label1>
              <Column>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요 (필수)"
              />
              <Text>최소 8자 이상, 영문, 숫자, 특수 기호 포함 </Text>
              </Column>
            </Field>

            {/* 비밀번호 확인 */}
            <Field>
              <Label>비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요 (필수)"
              />
            </Field>

            {/* 대학교 */}
            <Field>
              <Label>대학교 (선택)</Label>
              <Row>
              <Input
                id="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="대학교를 입력하세요 (선택)"
              />
              <Button type="button">
              {/* // onClick={() => setIsUniversityModalOpen(true)} */}
                  저장
                </Button>
                </Row>
            </Field>

            {/* 학과 */}
            <Field>
              <Label>학과 (선택)</Label>
              <Row>
              <Input
                id="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="학과를 입력하세요 (선택)"
              />
              <Button type="button">
              {/* onClick={() => setIsMajorModalOpen(true)}> */}
                저장
                </Button>
                </Row>
            </Field>

            {/* 추천코드 */}
            <Field>
              <Label1>추천인 코드 (선택)</Label1>
              <Column>
              <Input
                id="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="추천인 코드를 입력하세요 (선택)"
              />
              <Text>문제 생성 횟수가 3회 추가됩니다</Text>
              </Column>
            </Field>

            <SubmitButton type="submit" disabled={register.isPending}>
              회원가입
            </SubmitButton>
          </form>

          <BottomText>
            이미 계정이 있으신가요?
            <Link href="/login">로그인</Link>
          </BottomText>
        </Card>
      </Center>

      {/* 모달들 */}
      {/* <UniversitySearchModal
        isOpen={isUniversityModalOpen}
        onClose={() => setIsUniversityModalOpen(false)}
        onSelect={(u, id) => {
          setFormData((f) => ({ ...f, university: u, universityId: id }));
        }}
      />

      <MajorSearchModal
        isOpen={isMajorModalOpen}
        onClose={() => setIsMajorModalOpen(false)}
        onSelect={(major) => setFormData((f) => ({ ...f, major }))}
        selectedUniversity={formData.university}
        selectedUniversityId={formData.universityId}
      /> */}
      </Content>
    </Wrapper>
)
}
export default SignupPage;


const Wrapper = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden; /* 영상 튀어나가는 걸 방지 */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%);
  
`;


const Content = styled.div`
  position: relative;
  z-index: 2;
  `;

const BackButton = styled(Link)`
  position: absolute;
  top: 83px;
  left: 120px;
  z-index: 10;
  @media (max-width: 768px) {
    top: 101px;
    left: 30px;
    width: 30px;
    height: 30px;
  }
`;

const Center = styled.div`
  min-height: 100vh;
  padding-top: 135px;
  padding-bottom: 135px;
  display:flex;
  justify-content:center;
  //align-items:flex-start;
  @media (max-width: 768px) {

    padding-top: 97px;
    align-items: center;
    justify-content: center;
    width: 396px;
    margin: 0 auto;
  }
`;

const Card = styled.div`
  //width: 100%;
  border-radius: 18px;
  color: white;
   @media (max-width: 768px) {
    width: 90%;
    align-items: center;
    justify-content: center;

  }

`;

const Title = styled.h1`
  margin-bottom: 31px;
  text-align:center;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 41px;
  }
`;

const Field = styled.div`
  margin-bottom: 31px;
  display: flex;
  align-items: center;
  flex-direction: row;
    @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 356px;
  }
`;

const Label = styled.label`
  display: flex;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; 
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
  width: 150px;
  @media (max-width: 768px) {
    margin-right: 0px;
    justify-content: flex-start;
    margin-bottom: 5px;

  }
`;

const Label1 = styled.label`
  display: flex;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; 
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
  width: 150px;
  margin-bottom: 17px;
    @media (max-width: 768px) {
    margin-right: 0px;
    justify-content: flex-start;
    margin-bottom: 5px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 22px;
  @media (max-width: 768px) {
    gap: 12px;
    width: 100%;
   // min-width: 0;
  }
`;

const Input = styled.input`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.60);
  background: rgba(255, 255, 255, 0.30);
  color:white;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  width: 328px;
  height: 41px;
    @media (max-width: 768px) {
    //width: 100%;
    max-width: 290px;
    min-width: 180px;
    //width: auto;         
    font-size: 14px;
    height: 41px;

  }
`;

const Button = styled.button`
  height: 41px;
  padding: 0 24px;
  border-radius: 10px;
  background: var(--white-30, rgba(255, 255, 255, 0.30));
  color: white;
  font-family: "Apple SD Gothic Neo";
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  cursor: pointer;
  @media (max-width: 768px) {
    padding: 0 12px;
    font-size: 14px;
    max-width: 100px;
    min-width: 60px;
  }

`;

const SubmitButton = styled.button`
  width: 328px;
  height: 41px;
  padding: 0 24.957px;
  margin-top: 20px;
  border-radius: 10px;
  background: var(--black-100, linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), 
  linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), 
  linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #000);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.70);
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  margin-left: 170px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin: 0 auto;
  }

`;
const Text = styled.div`
  color: var(--white-100, #FFF);
  text-align: right;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-right: 10px;
  @media (max-width: 768px) {
  text-align: right;     
  margin-right: 68px;
  }

`
const Column = styled.div`
  display: flex;
  flex-direction: column;
    @media (max-width: 768px) {
    width: 100%;
  }

  `

const BottomText = styled.div`
  text-align:center;
  margin-top: 50px;
  color: var(--white-100, #FFF);
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.30);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  a {
    text-decoration: underline;
    margin-left: 20px;

    &:hover {
      opacity:1;
    }
  }
`;