import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import "./styles/globals.css";

export const metadata = {
  title: "Documentation Collaboration System",
  description:
    "Company documentation collaboration system with workspace, projects, sections and pages",
};

/**
 * ! check if our useToast work properly for this <Toaster  />
 * ! like provide some options.
 */

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
