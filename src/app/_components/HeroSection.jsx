"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import projectEditorUI from "./../../../assets/project-editor.png";
import ActionButton from "./ActionButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoveUpRight } from "lucide-react";

export default function HeroSection({ session, isAuthenticated, workspaceId, workspaceStatus }) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin");
  };

  return (
    <section className="container px-4 py-16 mx-auto md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          className="mb-6 text-4xl font-bold md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your team&apos;s knowledge base
        </motion.h1>
        <motion.p
          className="mx-auto mb-10 max-w-3xl text-xl md:text-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Lost in a mess of Docs? Never quite sure who has access? Colleagues requesting the same
          information repeatedly in chat? It&apos;s time to get your team&apos;s knowledge
          organized.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-full flex items-center justify-center gap-2">
            <ActionButton
              session={session}
              isAuthenticated={isAuthenticated}
              workspaceId={workspaceId}
              workspaceStatus={workspaceStatus}
            />

            {session && session.isWorkspaceOwner && (
              <Button
                onClick={handleClick}
                className="bg-red-400 text-white uppercase px-6 py-4 h-10 hover:bg-red-500"
              >
                Go to Admin Panel
                <MoveUpRight />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
      <motion.div
        className="relative mt-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div className="overflow-hidden relative mx-auto max-w-5xl rounded-lg shadow-2xl">
          <Image
            src={projectEditorUI}
            alt="Team Docs Interface"
            width={1200}
            height={675}
            className="rounded-lg"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
