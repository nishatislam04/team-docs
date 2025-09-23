"use client";

import { Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useServerFormAction } from "@/hooks/useServerFormAction";
import Logger from "@/lib/Logger";
import { deleteProjectAction } from "@/system/Actions/ProjectActions";
import { z as zod } from "zod";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";
import { useProjectsStore } from "../store/useProjectsStore";

export default function DeleteConfirmationDialog({ project }) {
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, setIsDeleteDialogClose } =
    useProjectDrawerStore();

  const schema = zod.object({});

  const form = useServerFormAction({
    schema,
    actionFn: () => deleteProjectAction(null, project.id),
    defaultValues: {},
    onStart: () => {
      setIsDeleteDialogClose();
    },
    onError: (errors) => {
      Logger.error(errors, "project delete failed");
    },
    optimistic: {
      start: () => {
        const { startDeleteOptimistic } = useProjectsStore.getState();
        const ctx = startDeleteOptimistic(project.id);
        return ctx;
      },
      commit: (ctx) => {
        const { commitDeleteOptimistic } = useProjectsStore.getState();
        commitDeleteOptimistic(ctx);
      },
      revert: (ctx, result) => {
        const { revertDeleteOptimistic } = useProjectsStore.getState();
        revertDeleteOptimistic(ctx);
        setIsDeleteDialogOpen(true);
        Logger.error(result, "optimistic delete reverted");
      },
    },
    successToast: {
      title: "Project deleted",
      description: "Project has been successfully deleted.",
    },
  });

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="flex cursor-pointer items-center gap-1"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash className="h-4 w-4" /> Delete
      </Button>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              <strong className="mx-1">{project.name}</strong>
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={form.formState.isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                form.onSubmit();
              }}
              disabled={form.formState.isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {form.formState.isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
