"use client";

import { Sparkles } from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";

export default function NoProjectUI() {
  return (
    <div className="mt-10 flex items-center justify-center px-4">
      <Card className="bg-background w-full max-w-2xl rounded-2xl border shadow-xl">
        <CardHeader className="mb-12 items-center space-y-4 text-center">
          <div className="text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" />
            <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900">
              No Project Found
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground max-w-xl text-base">
            Great! You’ve created a workspace. Now, create one or more projects to organize your
            documents, users, and access control with ease and clarity.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center pt-4">
          <CreateButtonShared
            onClick={() => useProjectDrawerStore.getState().setIsCreateDrawerOpen(true)}
          >
            Create Your First Project
          </CreateButtonShared>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  );
}
