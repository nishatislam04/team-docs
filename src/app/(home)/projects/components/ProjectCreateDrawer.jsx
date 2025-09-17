"use client";

import { useEffect, useMemo, useRef } from "react";
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
import { createProjectAction } from "@/system/Actions/ProjectActions";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";

export default function ProjectCreateDrawer() {
  const { isCreateDrawerOpen, setIsCreateDrawerOpen, setIsCreateDrawerClose } =
    useProjectDrawerStore();

  const hasShownToastRef = useRef(false);

  const defaultValues = useMemo(
    () => ({
      name: "",
      slug: "",
      description: "",
    }),
    []
  );

  const form = useServerFormAction({
    schema: ProjectSchema,
    defaultValues,
    actionFn: createProjectAction,
    onSuccess: () => {
      if (hasShownToastRef.current) return;
      hasShownToastRef.current = true;

      form.reset();
      setIsCreateDrawerClose();

      setTimeout(() => {
        hasShownToastRef.current = false;
      }, 500);
    },
    successToast: {
      title: "Project created successfully",
      description: "Your new project is ready to use!",
    },
  });

  const nameValue = form.watch("name");

  useEffect(() => {
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

  return (
    <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
      <DrawerContent
        side="right"
        className="ml-auto h-screen min-h-screen w-full max-w-md border-l shadow-xl"
      >
        <Form {...form}>
          <form onSubmit={form.onSubmit} className="flex h-full flex-col justify-between">
            <DrawerHeader className="ml-2">
              <DrawerTitle className="text-3xl">Create New Project</DrawerTitle>
              <DrawerDescription className="pl-1">
                Start a new project to manage pages.
              </DrawerDescription>
            </DrawerHeader>

            <div className="mt-auto flex h-full flex-1 flex-col space-y-6 overflow-y-auto px-6 py-4">
              {/* Name Field */}
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
                        className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-gray-500"
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
                        placeholder="Describe your project’s purpose..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />

              <DrawerFooter className="mt-auto border-t">
                <DrawerClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" disabled={form.isSubmitDisabled}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </DrawerFooter>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
