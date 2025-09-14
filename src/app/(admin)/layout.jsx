import ConditionalAdminLayout from "@/components/layout/admin/ConditionalAdminLayout";
import { Session } from "@/lib/Session";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { SessionProvider } from "next-auth/react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await Session.getCurrentUser();

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <ConditionalAdminLayout user={user}>{children}</ConditionalAdminLayout>
      </ThemeProvider>
    </SessionProvider>
  );
}
