"use client";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t py-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Logo and Company Description */}
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

            {/* Social Media Links */}
            <div className="mt-6 flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Tooltip key={social.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={social.href}
                      aria-label={social.name}
                      className="bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground rounded-full p-2 transition-colors"
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{social.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-8">
            {/* Products Section */}
            <div>
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                Products
              </h3>
              <ul className="mt-4 mr-6 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="group text-muted-foreground hover:text-foreground flex items-center transition-colors duration-200"
                    >
                      {/* <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
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
                      {/* <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div>
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
                      <link.icon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-70" />

        {/* Copyright and Legal Links */}
        <div className="flex flex-col items-center justify-between pt-4 md:flex-row">
          <p className="text-muted-foreground mb-4 text-sm md:mb-0">
            &copy; {currentYear} Team Docs, Inc. All rights reserved.
          </p>
          <div className="text-muted-foreground flex flex-wrap gap-5 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>
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

const socialLinks = [
  { name: "GitHub", href: "#", icon: Github },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
];

const legalLinks = [
  { text: "Privacy Policy", href: "#" },
  { text: "Terms of Service", href: "#" },
  { text: "Cookie Policy", href: "#" },
  { text: "Accessibility", href: "#" },
];
