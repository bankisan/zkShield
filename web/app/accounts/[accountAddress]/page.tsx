"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { accountAddress } = useParams();
  return (
    <div>
      <h1 className="text-xl font-bold mt-2">
        Shield Account: {accountAddress}
      </h1>
    </div>
  );
}
