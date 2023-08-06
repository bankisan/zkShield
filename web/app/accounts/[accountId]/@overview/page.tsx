import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Page() {
  return (
    <Card className="w-full h-full mt-6">
      <CardHeader>Invitation 0x1</CardHeader>
      <CardContent>
        <div>Invitation Sent to 0x0</div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
