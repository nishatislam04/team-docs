"use client";

import { useEffect } from "react";
import slugify from "slugify";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { updateProjectAction } from "@/system/Actions/ProjectActions";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";
import { useProjectsStore } from "../store/useProjectsStore";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";

export default function ProjectEditDrawer() {
  const { selectedProject, reset } = useSelectedProjectStore();
  const { setIsEditDrawerOpen, isEditDrawerOpen, setIsEditDrawerClose } = useProjectDrawerStore();

  const defaultValues = {
    name: selectedProject?.name || "",
    slug: selectedProject?.slug || "",
    description: selectedProject?.description || "",
  };

  const form = useServerFormAction({
    schema: ProjectSchema,
    actionFn: (formData) => updateProjectAction(selectedProject.id, formData),
    defaultValues,
    onStart: () => {
      setIsEditDrawerClose();
    },
    onSuccess: () => {
      form.reset();
      reset();
    },
    optimistic: {
      start: (formData) => {
        const { addOptimistic } = useProjectsStore.getState();
        const temp = addOptimistic({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });
        return { tempId: temp.id };
      },
      commit: (ctx, serverData) => {
        const { commitOptimistic } = useProjectsStore.getState();
        commitOptimistic(ctx.tempId, serverData);
      },
      revert: (ctx) => {
        const { revertOptimistic } = useProjectsStore.getState();
        revertOptimistic(ctx.tempId);
        setIsEditDrawerOpen(true);
      },
    },
    successToast: {
      title: "Project updated successfully",
      description: "Your project has been updated successfully.",
    },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (!nameValue) return;

    form.setValue(
      "slug",
      slugify(nameValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue, form.setValue]);

  useEffect(() => {
    if (selectedProject) {
      form.reset({
        name: selectedProject.name,
        slug: selectedProject.slug,
        description: selectedProject.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, form.reset]);

  if (!isEditDrawerOpen) return null;

  return (
    <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
      <DrawerContent
        side="right"
        className="ml-auto h-screen min-h-screen w-full max-w-md border-l shadow-xl"
      >
        <Form {...form}>
          <form onSubmit={form.onSubmit} className="flex h-full flex-col justify-between">
            <DrawerHeader className="ml-2">
              <DrawerTitle className="text-3xl">Edit Project</DrawerTitle>
              <DrawerDescription className="pl-1">
                Update your project information.
              </DrawerDescription>
            </DrawerHeader>

            <div className="mt-auto flex h-full flex-1 flex-col space-y-6 overflow-y-auto px-6 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Internal CRM"
                        className="h-11"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        className="w-full rounded-md border border-gray-200 px-4 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe your project's purpose..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />
            </div>

            <DrawerFooter className="mt-auto border-t">
              <DrawerClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" disabled={!slugValue || form.isSubmitDisabled}>
                {form.formState.isSubmitting ? "Updating..." : "Update Project"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
