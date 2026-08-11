import dynamic from "next/dynamic";
import { Suspense } from "react";
import { devDelay } from "@/lib/devDelay";

const RegistrationDialogComponent = dynamic(
  () =>
    import("./RegistrationDialog").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    loading: () => null,
    ssr: false,
  },
);

export default function RegistrationDialog({ isAuthenticated }) {
  return (
    <Suspense fallback={null}>
      <RegistrationDialogComponent isAuthenticated={isAuthenticated} />
    </Suspense>
  );
}
