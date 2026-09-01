"use client";

import { useEffect, useState } from "react";

const dateFormat = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" });

function getTodayLabel() {
  return dateFormat.format(new Date());
}

export default function CurrentDate() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const updateToday = () => setToday(getTodayLabel());

    updateToday();
    const intervalId = window.setInterval(updateToday, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <>{today || "오늘"}</>;
}
