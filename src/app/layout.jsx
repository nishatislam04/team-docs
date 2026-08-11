import { SessionProvider } from "next-auth/react";
// import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/provider/ThemeProvider";
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SessionProvider>
            {children}
            {/* <SpeedInsights /> */}
            {/* <Analytics /> */}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
