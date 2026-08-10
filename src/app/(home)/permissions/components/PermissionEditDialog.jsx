"use client";

import { use, useEffect, useMemo } from "react";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { updatePermissionAction } from "@/system/Actions/PermissionActions";

export default function PermissionEditDialog({
  isDialogOpen,
  setIsDialogOpen,
  setStartFetchPermissions,
  permission,
  projectsPromise,
}) {
  const projects = use(projectsPromise);

  const defaultValues = useMemo(
    () => ({
      name: permission?.name || "",
      scope: permission?.scope || "",
      projectScope: permission?.projectScope || "",
      description: permission?.description || "",
      action: permission?.action || "",
      resource: permission?.resource || "",
    }),
    [permission],
  );

  const form = useServerFormAction({
    schema: PermissionSchema,
    defaultValues,
    actionFn: (formData) =>
      updatePermissionAction({
        permissionId: permission.id,
        formData,
      }),
    onSuccess: () => {
      setIsDialogOpen(false);
      setStartFetchPermissions(true);
    },
    isDialogOpen,
    successToast: {
      title: "Permission updated successfully",
      description: "Your permission is ready to use!",
    },
  });

  useEffect(() => {
    if (permission && isDialogOpen) {
      form.reset({
        name: permission.name,
        scope: permission.scope,
        projectScope: permission.projectScope,
        description: permission.description || "",
        action: permission.action || "",
        resource: permission.resource || "",
      });
    }
  }, [isDialogOpen, form.reset, permission]);

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

          <ScrollArea className="max-h-[65vh] pr-4 w-full">
            <Form {...form}>
              <form onSubmit={form.onSubmit} className="mt-6 space-y-5 px-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permission Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. create, update, delete, view"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-1.5">
                  <Label htmlFor="scope">Permission Scope</Label>
                  <Input
                    id="scope"
                    placeholder="e.g. workspace, project, page"
                    className="h-11"
                    disabled
                    {...form.register("scope")}
                  />
                  {form.formState.errors.scope && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.scope.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="projectScope">Project Permission Scope</Label>
                  <FormField
                    control={form.control}
                    name="projectScope"
                    render={({ field }) => (
                      <FormItem>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-1/2 mt-2 h-11">
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {projects.length > 0 ? (
                              projects.map((project) => (
                                <SelectItem key={project.id} value={project.name}>
                                  {project.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled key={new Date().getTime()}>
                                No projects available
                              </SelectItem>
                            )}
                          </SelectContent>
                          <FormMessage />
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-1.5 w-full justify-start flex gap-6">
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permission Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CREATE">Create</SelectItem>
                            <SelectItem value="READ">Read</SelectItem>
                            <SelectItem value="UPDATE">Update</SelectItem>
                            <SelectItem value="DELETE">Delete</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permission Resource</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a resource" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PROJECT">Project</SelectItem>
                            <SelectItem value="SECTION">Section</SelectItem>
                            <SelectItem value="PAGE">Page</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ROLE">Role</SelectItem>
                            <SelectItem value="PERMISSION">Permission</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="What is this permission about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <GeneralFormErrorDispaly form={form} />

                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={form.isSubmitDisabled}>
                    {form.formState.isSubmitting ? "Updating..." : "Update Permission"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
