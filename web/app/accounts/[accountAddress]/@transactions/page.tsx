import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";


const Transaction = () => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>Transaction 0x1</CardHeader>
      <CardContent>
        <div>
          This is a simple transaction.
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="rounded-md px-6 mr-2">Sign</Button>
        <Button variant="outline" className="rounded-md px-6 mr-2" disabled>Submit</Button>
      </CardFooter>
    </Card>
  )
}

export default function Page() {
  return (
    <div>
      <div className="flex flex-row gap-2">
      <Button variant="outline" className="rounded-md my-4">New Transfer</Button>
      <Button variant="outline" className="rounded-md my-4">New Transaction</Button>
      </div>
      <div>
        <Transaction />
        <Transaction />
        <Transaction />
      </div>
    </div>
  );
}