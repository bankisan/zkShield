"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { accountAddress } = useParams();
  return (
    <div>
      <h1>{accountAddress}</h1>
    </div>
  );
}

