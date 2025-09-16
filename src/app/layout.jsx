import { AuthorizationToastProvider } from "@/components/abstracts/authorization-toast-provider";
import { Toaster } from "@/components/ui/sonner";
// import { Analytics } from "@vercel/analytics/next";
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
        <SessionProvider>
          {children}
          {/* <SpeedInsights /> */}
          {/* <Analytics /> */}
        </SessionProvider>
        <AuthorizationToastProvider />
        <Toaster />
      </body>
    </html>
  );
}
