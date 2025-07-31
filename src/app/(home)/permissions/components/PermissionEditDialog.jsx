"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePermissionAction } from "@/system/Actions/PermissionActions";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";

export default function PermissionEditDialog({
  isDialogOpen,
  setIsDialogOpen,
  setStartFetchPermissions,
  permission,
}) {
  const { register, errors, formAction, isPending, isSubmitDisabled, reset } = useServerFormAction({
    schema: PermissionSchema,
    actionFn: (formData) =>
      updatePermissionAction({
        permissionId: permission.id,
        formData,
      }),
    defaultValues: () => ({
      name: permission?.name || "",
      scope: permission?.scope || "",
      projectScope: permission?.projectScope || "",
      description: permission?.description || "",
      action: permission?.action || "",
      resource: permission?.resource || "",
    }),
    successToast: {
      title: "Permission updated successfully",
      description: "The permission changes have been saved.",
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      setStartFetchPermissions(true);
    },
    isDialogOpen,
  });

  useEffect(() => {
    if (isDialogOpen && permission) {
      reset({
        name: permission.name,
        scope: permission.scope,
        projectScope: permission.projectScope,
        description: permission.description || "",
        action: permission.action || "",
        resource: permission.resource || "",
      });
    }
  }, [isDialogOpen, reset, permission]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div id="edit-permission-dialog-trigger" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Permission</DialogTitle>
            <DialogDescription>Update the information for this permission.</DialogDescription>
          </DialogHeader>

          <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="scope">Permission Scope</Label>
              <Input
                id="scope"
                placeholder="e.g. workspace, project, page"
                className="h-11"
                {...register("scope")}
              />
              {errors.scope && <p className="mt-1 text-sm text-red-500">{errors.scope.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                placeholder="e.g. create, update, delete, view"
                className="h-11"
                {...register("name")}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="What is this permission about?"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="action">Permission Action</Label>
              <Input
                id="action"
                placeholder="e.g. create, update, delete, view"
                className="h-11"
                {...register("action")}
              />
              {errors.action && (
                <p className="mt-1 text-sm text-red-500">{errors.action.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="resource">Permission Resource</Label>
              <Input
                id="resource"
                placeholder="e.g. workspace, project, page"
                className="h-11"
                {...register("resource")}
              />
              {errors.resource && (
                <p className="mt-1 text-sm text-red-500">{errors.resource.message}</p>
              )}
            </div>

            {errors._form && (
              <div className="p-4 mb-4 border-l-4 border-red-500 bg-red-50">
                <p className="text-red-700">{errors._form.message}</p>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitDisabled}>
                {isPending ? "Updating..." : "Update Permission"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
