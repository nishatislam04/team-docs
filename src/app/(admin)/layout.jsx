import { Suspense } from "react";
import ConditionalAdminLayout from "@/components/layout/admin/ConditionalAdminLayout";
import { Session } from "@/lib/Session";

export default async function AdminLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading admin layout...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({ children }) {
  const user = await Session.getCurrentUser();

  return <ConditionalAdminLayout user={user}>{children}</ConditionalAdminLayout>;
}
