"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { accountId } = useParams();
  return (
    <div>
      <h1>{accountId}</h1>
    </div>
  );
}

