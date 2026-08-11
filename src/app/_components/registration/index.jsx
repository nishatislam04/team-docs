import dynamic from "next/dynamic";
import { Suspense } from "react";
import LandingLoading from "@/components/loading/LandingLoading";
import { devDelay } from "@/lib/devDelay";

const RegistrationDialogComponent = dynamic(
  () =>
    import("./RegistrationDialog").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    loading: () => <LandingLoading size="md" className="min-h-[100px]" />,
    ssr: false,
  },
);

export default function RegistrationDialog({ isAuthenticated }) {
  return (
    <Suspense fallback={<LandingLoading size="md" className="min-h-[100px]" />}>
      <RegistrationDialogComponent isAuthenticated={isAuthenticated} />
    </Suspense>
  );
}
