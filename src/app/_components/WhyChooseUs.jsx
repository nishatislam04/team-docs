"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  Check,
  FilePen,
  KeyRound,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const reasons = [
  {
    title: "Workspace-driven structure",
    description:
      "Everything lives in a shared workspace. Organize your knowledge into projects, sections, and pages so documentation stays structured and easy to navigate as your team grows.",
    icon: Building2,
    iconClass: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Fine-grained access control",
    description:
      "Decide exactly who can view, create, update, or delete anything. Permissions cover every resource — workspace, projects, sections, pages, users, roles, and more — down to the action level.",
    icon: ShieldCheck,
    iconClass: "bg-green-500/10 text-green-500",
  },
  {
    title: "Simple role & permission management",
    description:
      "Manage access with a clear permission manager: grant full access in one click, batch-update permissions across sections, and keep the whole workspace in sync without the usual admin headaches.",
    icon: KeyRound,
    iconClass: "bg-violet-500/10 text-violet-500",
  },
  {
    title: "A rich editing experience",
    description:
      "Author clean, formatted documentation with a powerful editor built for technical and product content — so your docs read as well as they are written.",
    icon: FilePen,
    iconClass: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Collaboration built in",
    description:
      "Leave annotations and comments right on the content, keep feedback close to the work, and turn documentation into a conversation instead of a handoff.",
    icon: MessageSquareText,
    iconClass: "bg-cyan-500/10 text-cyan-500",
  },
  {
    title: "Stay in the loop, find it fast",
    description:
      "Get notified about important activity and broadcasts across your workspace, and search your documentation instantly when you need to find something.",
    icon: Bell,
    iconClass: "bg-amber-500/10 text-amber-500",
  },
];

const highlights = [
  "Secure authentication & protected routes",
  "Day & night mode",
  "Invitations & member management",
  "Superadmin workspace oversight",
  "Internal docs organized by project & section",
  "Documentation distributed across your team",
];

export default function WhyChooseUs() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: gridRef, inView: gridInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const transition = (delay = 0) => ({
    duration: shouldReduceMotion ? 0 : 0.5,
    delay: shouldReduceMotion ? 0 : delay,
  });

  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background py-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="bg-primary/10 absolute top-10 -left-24 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-secondary/30 absolute -right-24 -bottom-24 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-3 sm:px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={transition()}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <Badge
            variant="outline"
            className="border-primary/30 text-primary mb-4 px-4 py-1 text-sm font-medium"
          >
            Why Choose Us
          </Badge>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Why you should choose us
          </h2>
          <p className="text-muted-foreground text-lg">
            We built Team Docs around the way real teams work — structured knowledge, clear
            permissions, and collaboration without the chaos.
          </p>
        </motion.div>

        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
            hidden: {},
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 24 },
                }}
                transition={transition()}
                whileHover={shouldReduceMotion ? {} : { y: -6 }}
                className="group"
              >
                <div className="border-border/60 bg-card hover:border-primary/30 relative h-full rounded-2xl border p-6 shadow-sm transition-all duration-300 group-hover:shadow-md">
                  <div
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      reason.iconClass,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{reason.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={transition(0.2)}
          className="border-border/60 bg-card/50 mx-auto mt-14 max-w-4xl rounded-2xl border px-4 py-5 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3">
                <span className="bg-primary/8 flex size-7 shrink-0 items-center justify-center rounded-md">
                  <Check className="text-primary size-3.5" aria-hidden="true" />
                </span>
                <span className="text-muted-foreground pt-0.5 text-sm font-medium leading-snug">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
