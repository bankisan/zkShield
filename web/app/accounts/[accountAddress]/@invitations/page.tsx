import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const Invitation = () => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>Invitation 0x1</CardHeader>
      <CardContent>
        <div>
          Invitation Sent to 0x0
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="rounded-md px-6 mr-2">Rescind</Button>
      </CardFooter>
    </Card>
  )
}

export default function Page() {
  return (
    <div>
      <Button variant="outline" className="rounded-md my-4">New Invitation</Button>
      <div>
        <Invitation />
        <Invitation />
        <Invitation />
      </div>
    </div>
  );
}