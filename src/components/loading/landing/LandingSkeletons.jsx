import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function FeatureCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <Skeleton className="size-10 rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function HeaderProfileSkeleton({ className }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
}

export function ActionButtonSkeleton({ className }) {
  return <Skeleton className={cn("h-11 w-44 rounded-md", className)} />;
}

export function FeaturedSectionSkeleton({ className }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-linear-to-b from-secondary/30 via-secondary/20 to-background py-24",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-7 w-36 rounded-full" />
          <Skeleton className="mx-auto h-12 w-full max-w-xl" />
          <Skeleton className="mx-auto h-6 w-full max-w-lg" />
        </div>

        <Skeleton className="mx-auto mb-8 h-10 w-full max-w-md rounded-lg" />

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {["feature-a", "feature-b", "feature-c"].map((id) => (
            <FeatureCardSkeleton key={id} />
          ))}
        </div>

        <div className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-4">
          <Skeleton className="h-6 w-80 max-w-full" />
          <ActionButtonSkeleton className="w-48" />
        </div>
      </div>
    </section>
  );
}

export function FooterSocialsSkeleton({ className }) {
  return (
    <div className={cn("mt-6 flex items-center gap-4", className)}>
      {["github", "twitter", "linkedin", "facebook", "instagram"].map((id) => (
        <Skeleton key={id} className="size-9 rounded-full" />
      ))}
    </div>
  );
}

export function LandingPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center">
          <Skeleton className="mr-2 size-9 rounded-md" />
          <Skeleton className="h-7 w-28" />
        </div>
        <HeaderProfileSkeleton />
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <Skeleton className="mx-auto h-14 w-full max-w-2xl" />
          <div className="mx-auto max-w-3xl space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="mx-auto h-6 w-4/5" />
          </div>
          <div className="flex h-28 w-full items-center justify-center gap-2">
            <ActionButtonSkeleton />
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
        <Skeleton className="mx-auto mt-16 aspect-video w-full max-w-5xl rounded-lg shadow-2xl" />
      </section>

      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <Skeleton className="mx-auto h-7 w-40 rounded-full" />
            <Skeleton className="mx-auto h-10 w-full max-w-lg" />
            <Skeleton className="mx-auto h-6 w-full max-w-md" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {["reason-1", "reason-2", "reason-3", "reason-4", "reason-5", "reason-6"].map((id) => (
              <FeatureCardSkeleton key={id} />
            ))}
          </div>
        </div>
      </section>

      <FeaturedSectionSkeleton />

      <footer className="border-t py-16">
        <div className="container mx-auto space-y-8 px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-4">
              <div className="flex items-center">
                <Skeleton className="mr-3 size-10 rounded-md" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-full max-w-sm" />
                <Skeleton className="h-4 w-2/3 max-w-xs" />
              </div>
              <FooterSocialsSkeleton />
            </div>
            {["products", "company", "contact"].map((id) => (
              <div key={id} className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-3">
                  {["link-1", "link-2", "link-3", "link-4", "link-5"].map((linkId) => (
                    <Skeleton key={linkId} className="h-4 w-32" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-4">
              {["privacy", "terms", "cookies", "accessibility"].map((id) => (
                <Skeleton key={id} className="h-4 w-20" />
              ))}
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function AuthFormSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-9 w-56" />
        <Skeleton className="mx-auto h-5 w-72" />
      </div>
      <div className="space-y-6">
        {["field-1", "field-2", "field-3"].map((id) => (
          <div key={id} className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  );
}
