"use client";

import { useEffect, useState } from "react";

export const useCookie = (name: string) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
      const newValue = document.cookie
        .split(";")
        .find((item) => item.trim().startsWith(`${name}=`));
      setValue(newValue?.substring(`${name}=`.length));
  }, [name])

  return value;
};
