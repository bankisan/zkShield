"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { accountId } = useParams();
  // const send = () => {
  //   fetch(`/api/accounts/${accountId}/send`, {
  //     method: 'POST',
  //     body: JSON.stringify({ userOpId: 1 }),
  //     headers: { 'Content-Type': 'application/json' },
  //   }).then((res) => console.log(res.ok))
  // }

  // (window as any).send = send
  return (
    <div>
      <h1 className="text-xl font-bold mt-2">
        Shield Account: {accountId}
      </h1>
    </div>
  );
}
