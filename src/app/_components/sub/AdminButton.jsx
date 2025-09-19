"use client";

import { Button } from "@/components/ui/button";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { MoveUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminButton() {
  const router = useRouter();
  const userSession = useCurrentSession();
  const isAdmin = !!userSession?.isSuperAdmin;

  if (!isAdmin) return null;

  return (
    <Button
      onClick={() => router.push("/admin")}
      className="h-10 bg-red-400 px-6 py-4 text-white uppercase hover:bg-red-500"
    >
      Go to Admin Panel
      <MoveUpRight />
    </Button>
  );
}
