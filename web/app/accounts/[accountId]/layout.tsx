import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Layout(props: {
  overview: ReactNode;
  transactions: ReactNode;
  invitations: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="flex flex-col flex-grow w-full h-full">
      <CardContent className="mt-6">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-row justify-between w-full">
            <div>{props.children}</div>
            <TabsList >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview">{props.overview}</TabsContent>
          <TabsContent value="transactions">{props.transactions}</TabsContent>
          <TabsContent value="invitations">{props.invitations}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
