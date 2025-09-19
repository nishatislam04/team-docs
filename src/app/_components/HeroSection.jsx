import Image from "next/image";
import projectEditorUI from "../../../assets/project-editor.png";
import ActionButtonWrapper from "./sub/ActionButtonWrapper";
import AdminButton from "./sub/AdminButton";

export default function HeroSection({ workspace }) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">Your team&apos;s knowledge base</h1>
        <p className="text-muted-foreground mx-auto mb-10 max-w-3xl text-xl md:text-2xl">
          Lost in a mess of Docs? Never quite sure who has access? Colleagues requesting the same
          information repeatedly in chat? It&apos;s time to get your team&apos;s knowledge
          organized.
        </p>
        <div className="flex h-28 w-full items-center justify-center gap-2">
          <ActionButtonWrapper workspace={workspace} />
          <AdminButton />
        </div>
      </div>
      <div className="relative mt-16">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg shadow-2xl">
          <Image
            src={projectEditorUI}
            alt="Team Docs Interface"
            width={1200}
            height={675}
            className="rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      </div>
    </section>
  );
}
