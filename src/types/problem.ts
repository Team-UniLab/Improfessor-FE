export interface Problem {
  problemId: number;
  type: string;
  content: string;
  description: string;
  answer: string;
}

export interface GenerateProblemData {
  fileName: string;
  problems: Problem[];
  problemCount: number;
  message: string;
}

export interface GenerateProblemResponse {
  status: string;
  code: string;
  message: string;
  data: GenerateProblemData;
}

export interface GenerateProblemRequest {
  conceptFiles: File[];
  formatFiles?: File[];
} 

/** SSE - 진행률(progress) 이벤트 타입 */
export type ProgressEvent = {
  stage: string;
  progress: number;
  message: string;
};

/** SSE - 완료(complete) 이벤트 타입 */
export type CompleteEvent = {
  fileName: string;
  problems: Problem[];
  problemCount: number;
  message: string;
  requestedCount: number;
  successRate: number;
};

/** SSE - 에러(error) 이벤트 타입 */
export type ErrorEvent = {
  code: string;
  message: string;
};


export type UseProblemReturn = {
  generateProblemWithProgress: (args: {
    conceptFiles: File[];
    formatFiles?: File[];
    onProgress: (data: ProgressEvent) => void;
    onComplete:  (data: CompleteEvent) => void;
    onError?: (err: unknown) => void;
  }) => Promise<void>;
  downloadProblemPDF: (problems: Problem[]) => Promise<void>;
};