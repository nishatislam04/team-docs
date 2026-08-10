import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
// import { Analytics } from "@vercel/analytics/next";
import { AuthorizationToastProvider } from "@/components/abstracts/authorization-toast-provider";
import { Toaster } from "@/components/ui/sonner";
import "./styles/globals.css";

export const metadata = {
  title: "Documentation Collaboration System",
  description:
    "Company documentation collaboration system with workspace, projects, sections and pages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          {children}
          {/* <SpeedInsights /> */}
          {/* <Analytics /> */}
        </SessionProvider>
        <Suspense fallback={null}>
          <AuthorizationToastProvider />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
