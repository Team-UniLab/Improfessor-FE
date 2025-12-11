"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GAProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");

    // 페이지뷰 전송
    window.gtag?.("config", "G-JPHYW9NPWN", {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
