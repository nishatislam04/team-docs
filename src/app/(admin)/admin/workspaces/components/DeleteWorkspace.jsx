"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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

import { deleteWorkspaceAction } from "@/system/Actions/WorkspaceActions";
import { toast } from "sonner";
import Logger from "@/lib/Logger";

export default function DeleteWorkspace({ workspace, setStartFetchWorkspaces }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteWorkspaceAction(workspace.id);

      if (result.success) {
        toast.success("Workspace deleted", {
          description: "Workspace has been successfully deleted.",
        });
        setIsOpen(false);
        setStartFetchWorkspaces(true);
      } else {
        toast.error("Failed to delete workspace", {
          description:
            result.errors?._form?.[0] || "An error occurred while deleting the workspace.",
        });
      }
    } catch (error) {
      Logger.error(error.message, "Failed to delete workspace:");
      toast.error("Failed to delete workspace", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        className="cursor-pointer bg-red-600 hover:text-white-500 hover:bg-red-500 text-white px-5 py-2.5 text-base"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="mr-2 w-5 h-5 text-white" />
        Delete
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong className="font-medium">&quot;{workspace.name}&quot;</strong> workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
