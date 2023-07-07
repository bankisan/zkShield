"use client";

import { useEffect, useState } from "react";

export const useCookie = (name: string) => {
  const [value, setValue] = useState(() => {
    return document.cookie
      .split(";")
      .find((item) => item.trim().startsWith(`${name}=`));
  });

  useEffect(() => {
    const handler = () => {
      const newValue = document.cookie
        .split(";")
        .find((item) => item.trim().startsWith(`${name}=`));
      setValue(newValue);
    };

    window.addEventListener("cookiechange", handler);

    return () => {
      window.removeEventListener("cookiechange", handler);
    };
  }, [name]);

  return value;
};
