//import { useQueryClient } from '@tanstack/react-query';
//import { axiosInstance } from '@/lib/axios';
import {  Problem , ProgressEvent, CompleteEvent, UseProblemReturn} from '@/types/problem';
import { useUser } from '@/context/UserContext';
//import { ApiResponse, UserInfo } from '@/types/auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useProblem = () : UseProblemReturn => {
  const { user } = useUser();
  //const queryClient = useQueryClient();
    const generateProblemWithProgress = async ({
    conceptFiles,
    formatFiles,
    onProgress,
    onComplete,
    onError,
  }: {
    conceptFiles: File[];
    formatFiles?: File[];
    onProgress: (data: ProgressEvent) => void;
    onComplete:  (data: CompleteEvent) => void;
    onError?: (err: unknown) => void;
  }) => {
    if (!user?.userId) return;

    const formData = new FormData();
    conceptFiles.forEach((f) => formData.append("conceptFiles", f));
    formatFiles?.forEach((f) => formData.append("formatFiles", f));

    try {
      const response = await fetch(
        `https://api.improfessor.o-r.kr/api/problems/${user.userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE는 \n\n로 이벤트가 구분됨
        const events = buffer.split("\n\n");

        // 마지막은 완전하지 않을 수 있으니 buffer에 남겨둠
        buffer = events.pop() || "";

        for (const event of events) {
  if (!event.trim()) continue;

  const lines = event.trim().split("\n");

  let eventName = "";
  let dataJson: unknown = null;

  for (const line of lines) {
    if (line.startsWith("event")) {
      // event: progress / event:progress 다 잡음
      eventName = line.replace("event:", "").trim();
    }

    if (line.startsWith("data")) {
      // data: {...} / data:{...} 다 잡음
      const jsonStr = line.replace("data:", "").trim();
      try {
        dataJson = JSON.parse(jsonStr);
      } catch {
        console.warn("JSON 파싱 실패:", line);
      }
    }
  }

  if (!eventName || !dataJson) continue;

  if (eventName === "progress") {
    onProgress(dataJson as ProgressEvent);
  }

  if (eventName === "complete") {
    onComplete(dataJson as CompleteEvent);
  }
}

      }
    } catch (err) {
      console.error("SSE 처리 실패:", err);
      onError?.(err);
    }
  };

  // 기존 서버 PDF 다운로드 (임시 주석 처리)
  // const downloadProblemPDF = async (downloadKey: string) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/problems/download/${downloadKey}`, {
  //       responseType: 'blob',
  //     });
      
  //     // Blob 생성 및 다운로드
  //     const blob = new Blob([response.data], { type: 'application/pdf' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `problems_${downloadKey}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('PDF 다운로드 실패:', error);
  //     throw error;
  //   }
  // };

  // 클라이언트 사이드 PDF 생성 및 다운로드
  const downloadProblemPDF = async (problems: Problem[]) => {
    try {
      // 임시 HTML 요소 생성
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      
      // HTML 내용 생성
      let htmlContent = `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;">
            생성된 문제
          </h1>
        </div>
      `;

      problems.forEach((problem, index) => {
        htmlContent += `
          <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">
              문제 ${index+1}
            </h3>
            
            <div style="margin-bottom: 15px;">
              <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">문제 유형</h4>
              <p style="color: #333; white-space: pre-wrap;">${problem.type}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">문제 내용</h4>
              <p style="color: #333; white-space: pre-wrap;">${problem.content}</p>
            </div>
            
            ${problem.description ? `
              <div style="margin-bottom: 15px;">
                <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">설명</h4>
                <p style="color: #333; white-space: pre-wrap;">${problem.description}</p>
              </div>
            ` : ''}
            
            <div>
              <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">정답</h4>
              <p style="color: #333; white-space: pre-wrap;">${problem.answer}</p>
            </div>
          </div>
        `;
      });

      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // HTML을 캔버스로 변환
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // 캔버스를 PDF로 변환
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 너비
      const pageHeight = 295; // A4 높이
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 임시 요소 제거
      document.body.removeChild(tempDiv);

      // PDF 다운로드
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      pdf.save(`problems_${timestamp}.pdf`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      throw error;
    }
  };

  return {
    generateProblemWithProgress,
    downloadProblemPDF,
  };
};

export default useProblem; 