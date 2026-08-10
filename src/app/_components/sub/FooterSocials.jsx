"use client";

import { Bird, BriefcaseBusiness, Camera, GitFork, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const socialLinks = [
  { name: "GitHub", href: "#", icon: GitFork },
  { name: "Twitter", href: "#", icon: Bird },
  { name: "LinkedIn", href: "#", icon: BriefcaseBusiness },
  { name: "Facebook", href: "#", icon: ThumbsUp },
  { name: "Instagram", href: "#", icon: Camera },
];

export default function FooterSocials() {
  return (
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
  );
}
