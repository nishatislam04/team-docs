import { Suspense } from "react";
import ConditionalAdminLayout from "@/components/layout/admin/ConditionalAdminLayout";
import { Session } from "@/lib/Session";
import { ThemeProvider } from "@/provider/ThemeProvider";

export default async function AdminLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Suspense fallback={<div>Loading admin layout...</div>}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </Suspense>
    </ThemeProvider>
  );
}

async function AdminLayoutContent({ children }) {
  const user = await Session.getCurrentUser();

  return <ConditionalAdminLayout user={user}>{children}</ConditionalAdminLayout>;
}
