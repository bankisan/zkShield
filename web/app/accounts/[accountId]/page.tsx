"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { accountId } = useParams();
  const deploy = () => {
    fetch(`/api/accounts/${accountId}/deploy`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => console.log(res.ok))
  }
  const send = () => {
    fetch(`/api/accounts/${accountId}/send`, {
      method: 'POST',
      body: JSON.stringify({ userOpId: 1 }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => console.log(res.ok))
  }

  (window as any).deploy = deploy;
  (window as any).send = send
  return (
    <div>
      <h1 className="text-xl font-bold mt-2">
        Shield Account: {accountId}
      </h1>
    </div>
  );
}
