import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-9xl font-black tracking-tight text-destructive">403</h1>
        <h2 className="mt-4 whitespace-nowrap text-5xl font-extrabold text-foreground">
          You are not authorized to view this page now.
        </h2>
        <p className="mt-2 text-lg font-medium text-muted-foreground">
          Please contact your superadmin to get permission.
        </p>
        <Button asChild className="mt-12">
          <Link href="/home">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
