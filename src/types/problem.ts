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