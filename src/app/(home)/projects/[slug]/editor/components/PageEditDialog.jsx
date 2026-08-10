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
import { updatePageAction } from "@/system/Actions/PageSections";

export default function PageEditDialog({ page, isDialogOpen, setIsDialogOpen }) {
  const defaultValues = useMemo(
    () => ({
      title: page?.title || "",
      description: page?.description || "",
    }),
    [page],
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const form = useServerFormAction({
    schema: PageSchema,
    defaultValues,
    actionFn: (formData) => updatePageAction(page?.id, formData),
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Page updated successfully",
      description: "Your page has been updated!",
    },
  });

  if (!page) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="edit-page-dialog-trigger" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Page</DialogTitle>
          <DialogDescription>Update the details of this page.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
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
                {form.formState.isPending ? "Updating..." : "Update Page"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
