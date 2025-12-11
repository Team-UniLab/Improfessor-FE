/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: { [key: string]: any }
    ) => void;
  }
}

export {};
