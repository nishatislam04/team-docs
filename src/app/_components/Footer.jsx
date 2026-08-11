import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ThemeToggle } from "@/components/abstracts/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default async function Footer() {
  await connection(); // Mark as dynamic for Cache Components
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t py-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-4 flex items-center">
              <Image
                src="/logo.svg"
                alt="Team Docs Logo"
                width={40}
                height={40}
                className="mr-3 transition-transform duration-300 hover:scale-110"
              />
              <span className="text-foreground text-2xl font-bold">Team Docs</span>
            </div>
            <p className="text-muted-foreground mt-2 max-w-md text-sm">
              Streamline your team&apos;s documentation workflow with our collaborative platform.
              Create, share, and manage documents with ease in a single, integrated workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:col-span-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                  Products
                </h3>
                <ul className="mt-4 space-y-3">
                  {productLinks.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="group text-muted-foreground hover:text-foreground flex items-center transition-colors duration-200"
                      >
                        <span>{link.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="group text-muted-foreground hover:text-foreground flex items-center transition-colors duration-200"
                      >
                        <span>{link.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-3">
                {contactLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="group text-muted-foreground hover:text-foreground flex items-center transition-colors duration-200"
                    >
                      <link.icon className="mr-2 h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-70" />

        <div className="flex flex-col items-center gap-4 pt-4">
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-5 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.text}
              </Link>
            ))}
            <ThemeToggle className="border-border size-9 rounded-full border" />
          </div>
          <p className="text-muted-foreground text-center text-sm">
            &copy; {currentYear} Team Docs, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const productLinks = [
  { text: "Documentation", href: "#" },
  { text: "Collaboration", href: "#" },
  { text: "Team Management", href: "#" },
  { text: "Integrations", href: "#" },
  { text: "API", href: "#" },
];

const companyLinks = [
  { text: "About", href: "#" },
  { text: "Careers", href: "#" },
  { text: "Blog", href: "#" },
  { text: "Partners", href: "#" },
  { text: "Terms of Use", href: "#" },
];

const contactLinks = [
  { text: "Contact", href: "#", icon: MapPin },
  { text: "support@teamdocs.com", href: "#", icon: Mail },
  { text: "+1 (555) 123-4567", href: "#", icon: Phone },
];

const legalLinks = [
  { text: "Privacy Policy", href: "#" },
  { text: "Terms of Service", href: "#" },
  { text: "Cookie Policy", href: "#" },
  { text: "Accessibility", href: "#" },
];
