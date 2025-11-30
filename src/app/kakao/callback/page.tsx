'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      alert("카카오 로그인 실패!");
      router.push("/login");
      return;
    }

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      router.push("/generate"); // 로그인 후 generate로 이동
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}
