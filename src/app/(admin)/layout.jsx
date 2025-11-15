import ConditionalAdminLayout from "@/components/layout/admin/ConditionalAdminLayout";
import { Session } from "@/lib/Session";
import { ThemeProvider } from "@/provider/ThemeProvider";

export default async function AdminLayout({ children }) {
  const user = await Session.getCurrentUser();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ConditionalAdminLayout user={user}>{children}</ConditionalAdminLayout>
    </ThemeProvider>
  );
}
