"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { SectionSchema } from "@/lib/schemas/SectionSchema";
import { createSection } from "@/system/Actions/SectionActions";
import { useCallback, useMemo } from "react";

export default function CreateSectionDialog({ project, isDialogOpen, setIsDialogOpen }) {
  const defaultValues = useMemo(
    () => ({
      name: "",
      description: "",
      projectId: project.id,
    }),
    [project.id]
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const form = useServerFormAction({
    schema: SectionSchema,
    defaultValues,
    actionFn: createSection,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Section created successfully",
      description: "Your new section is ready to use!",
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="create-section-dialog-trigger" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create a New Section</DialogTitle>
          <DialogDescription>
            Provide a name and optional description for the new section in your project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
            <input type="hidden" name="projectId" value={project.id} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Project Management, Team Management"
                      className="h-11"
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
                  <FormLabel>
                    Description <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is this section about?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <GeneralFormErrorDispaly form={form} />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={form.isSubmitDisabled}>
                {form.formState.isPending ? "Creating..." : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
