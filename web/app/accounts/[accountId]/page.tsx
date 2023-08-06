"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { accountId } = useParams();
  return (
    <div>
      <h1 className="text-xl font-bold mt-2">
        Shield Account: {accountId}
      </h1>
    </div>
  );
}
