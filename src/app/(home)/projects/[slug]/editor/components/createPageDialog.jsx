"use client";

import { useCallback, useMemo } from "react";
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
import { PageSchema } from "@/lib/schemas/PageSchema";
import { createPage } from "@/system/Actions/PageSections";

export default function CreatePageDialog({ sectionId, isDialogOpen, setIsDialogOpen }) {
  const defaultValues = useMemo(
    () => ({
      title: "",
      description: "",
      sectionId,
    }),
    [sectionId],
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const form = useServerFormAction({
    schema: PageSchema,
    defaultValues,
    actionFn: createPage,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Page created successfully",
      description: "Your new page is ready to use!",
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="create-section-dialog-trigger" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create a New Page</DialogTitle>
          <DialogDescription>
            Provide a title and optional description for the new page for this section.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
            <input type="hidden" name="sectionId" value={sectionId} />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Getting Started, Advanced Usage etc."
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
                    <Textarea placeholder="What is this page about?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <GeneralFormErrorDispaly form={form} />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={form.isSubmitDisabled}>
                {form.formState.isPending ? "Creating..." : "Create Page"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
