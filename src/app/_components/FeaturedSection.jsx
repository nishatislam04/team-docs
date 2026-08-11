"use client";

import { motion } from "framer-motion";
import { ChevronRight, Globe, Moon, Palette, Shield, Users, Zap } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LandingLoading from "@/components/loading/LandingLoading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { cn } from "@/lib/utils";
import ActionButton from "./ActionButton";

const featureCategories = [
  { value: "core", label: "Core Features" },
  { value: "collab", label: "Collaboration" },
  { value: "custom", label: "Customization" },
];

export default function FeaturedSection({ workspace }) {
  const userSession = useCurrentSession();
  const isAuthenticated = !!userSession;
  const [activeCategory, setActiveCategory] = useState("core");
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="from-secondary/30 via-secondary/20 to-background relative overflow-hidden bg-gradient-to-b py-24"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="bg-primary/10 absolute -top-20 -left-20 h-60 w-60 rounded-full blur-3xl" />
        <div className="bg-secondary/20 absolute top-40 -right-20 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <Badge
            variant="outline"
            className="border-primary/30 text-primary mb-4 px-4 py-1 text-sm font-medium"
          >
            Why Team Docs
          </Badge>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Streamline your team&apos;s documentation
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover why thousands of teams choose Team Docs to organize, collaborate and share
            knowledge.
          </p>
        </motion.div>

        {/* Tabs for larger screens */}
        <div className="hidden md:block">
          <Tabs
            defaultValue="core"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mx-auto max-w-5xl"
          >
            <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
              {featureCategories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:text-primary relative"
                >
                  {category.label}
                  {activeCategory === category.value && (
                    <motion.div
                      className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                      layoutId="activeTab"
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {featureCategories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="relative mt-0">
                <motion.div
                  key={`${category.value}-content`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {getFeaturesForCategory(category.value).map((feature, index) => (
                    <FeatureCard
                      key={feature.title}
                      feature={feature}
                      index={index}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Carousel for mobile */}
        <div className="block md:hidden">
          <Tabs
            defaultValue="core"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-3">
              {featureCategories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {featureCategories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="mt-0">
                <motion.div
                  key={`${category.value}-mobile-content`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                >
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {getFeaturesForCategory(category.value).map((feature, index) => (
                        <CarouselItem
                          key={feature.title}
                          className="pl-1 md:basis-1/2 lg:basis-1/3"
                        >
                          <FeatureCard
                            feature={feature}
                            index={index}
                            shouldReduceMotion={shouldReduceMotion}
                            isCarousel={true}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="mt-4 flex justify-center gap-2">
                      <CarouselPrevious className="mx-1" />
                      <CarouselNext className="mx-1" />
                    </div>
                  </Carousel>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.3 }}
          className="mx-auto mt-16 flex max-w-xl flex-col items-center justify-center text-center"
        >
          <p className="mb-6 text-lg font-medium">
            Ready to transform your team&apos;s documentation experience?
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Suspense fallback={<LandingLoading size="sm" className="min-h-[44px] min-w-[180px]" />}>
              <ActionButton isAuthenticated={isAuthenticated} workspace={workspace} />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Feature Card Component
function FeatureCard({ feature, index, shouldReduceMotion, isCarousel = false }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const staggerDelay = isCarousel ? 0 : index * 0.1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: staggerDelay }}
      whileHover={shouldReduceMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="bg-card border-muted/60 hover:border-primary/20 relative h-full overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="from-primary/60 to-primary/10 absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="pb-2">
          <div className="mb-2 flex items-center">
            <div
              className={cn(
                "mr-3 flex h-10 w-10 items-center justify-center rounded-lg",
                `bg-${feature.colorClass}/10 text-${feature.colorClass}`,
              )}
            >
              {feature.icon}
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground text-base">
            {feature.description}
          </CardDescription>

          {feature.highlight && (
            <div className="text-primary mt-4 flex items-center text-sm font-medium">
              <span>Learn more</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Organize features by category
function getFeaturesForCategory(category) {
  return features.filter((feature) => feature.category === category);
}

// Enhanced features array with icons and categories
const features = [
  {
    title: "Blazing fast",
    description:
      "Experience millisecond response times with instant document loading, speedy search, and a snappy UI that keeps your team productive.",
    icon: <Zap className="h-5 w-5" />,
    colorClass: "yellow-500",
    category: "core",
    highlight: true,
  },
  {
    title: "Real-time collaboration",
    description:
      "Work together seamlessly with real-time editing, comments, and presence indicators that show who's viewing or editing documents.",
    icon: <Users className="h-5 w-5" />,
    colorClass: "blue-500",
    category: "collab",
  },
  {
    title: "Beautiful dark mode",
    description:
      "For the night owls, we've got you covered with a beautiful dark mode that reduces eye strain during those late-night documentation sessions.",
    icon: <Moon className="h-5 w-5" />,
    colorClass: "indigo-500",
    category: "custom",
  },
  {
    title: "Advanced permissions",
    description:
      "Granular control with role-based permissions, user groups, guest access, and public sharing options to protect sensitive information.",
    icon: <Shield className="h-5 w-5" />,
    colorClass: "green-500",
    category: "core",
  },
  {
    title: "Transparent development",
    description:
      "Follow our journey with our public roadmap and regular feature updates. Your feedback directly shapes the future of Team Docs.",
    icon: <Globe className="h-5 w-5" />,
    colorClass: "purple-500",
    category: "collab",
    highlight: true,
  },
  {
    title: "White labeling & branding",
    description:
      "Custom domains for docs.yourteam.com and complete customization of colors, logos, and styling to match your brand identity.",
    icon: <Palette className="h-5 w-5" />,
    colorClass: "pink-500",
    category: "custom",
  },
  {
    title: "Automatic backups",
    description:
      "Peace of mind with automatic versioning and backups, making it easy to restore previous versions or track document history.",
    icon: <Shield className="h-5 w-5" />,
    colorClass: "red-500",
    category: "core",
  },
  {
    title: "Smart notifications",
    description:
      "Stay in the loop with customizable notifications for document changes, @mentions, and important updates across your workspace.",
    icon: <Users className="h-5 w-5" />,
    colorClass: "teal-500",
    category: "collab",
  },
  {
    title: "Markdown & rich text",
    description:
      "Write your way with support for both markdown and rich text editing, giving your team flexibility in how they create content.",
    icon: <Palette className="h-5 w-5" />,
    colorClass: "orange-500",
    category: "custom",
    highlight: true,
  },
];
