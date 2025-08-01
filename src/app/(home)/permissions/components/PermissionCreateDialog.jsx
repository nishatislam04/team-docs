"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPermissions } from "@/system/Actions/PermissionActions";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { getAllProjectsFn } from "./../actions/getAllProjects";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PermissionCreateDialog({
  isDialogOpen,
  setIsDialogOpen,
  setStartFetchPermissions,
}) {
  const [projects, setProjects] = useState([]);

  // ! maybe use react use() or transition not useEFFECT!
  useEffect(() => {
    getAllProjectsFn().then((res) => {
      setProjects(res);
    });
  }, []);

  const defaultValues = useMemo(() => {
    return {
      name: "",
      description: "",
      projectScope: "",
      action: "",
      resource: "",
    };
  }, []);

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setStartFetchPermissions(true);
  }, [setIsDialogOpen, setStartFetchPermissions]);

  const form = useServerFormAction({
    schema: PermissionSchema,
    defaultValues,
    actionFn: createPermissions,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Permission created successfully",
      description: "Your new permission is ready to use!",
    },
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div id="create-role-drawer-trigger" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create a New Permission</DialogTitle>
            <DialogDescription>
              Provide a name and optional description for the new permission in your system.
            </DialogDescription>
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

                <div className="space-y-1">
                  <Label htmlFor="projectScope">Permission Scope</Label>
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
                              <SelectItem disabled key="no-projects">
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
                    {form.formState.isSubmitting ? "Creating..." : "Create Permission"}
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
