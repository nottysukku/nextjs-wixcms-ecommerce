"use client";

import { useEffect, useState } from "react";

const Copyright = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Show fallback during hydration to prevent mismatch
  if (year === null) {
    return <div className="">© SUKKU Shop</div>;
  }

  return <div className="">© {year} SUKKU Shop</div>;
};

export default Copyright;
