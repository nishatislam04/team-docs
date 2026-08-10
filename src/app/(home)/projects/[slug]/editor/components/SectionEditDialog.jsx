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
import { SectionSchema } from "@/lib/schemas/SectionSchema";
import { updateSectionAction } from "@/system/Actions/SectionActions";

export default function SectionEditDialog({ section, isDialogOpen, setIsDialogOpen }) {
  const defaultValues = useMemo(
    () => ({
      name: section?.name || "",
      description: section?.description || "",
    }),
    [section],
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const form = useServerFormAction({
    schema: SectionSchema,
    defaultValues,
    actionFn: (formData) => updateSectionAction(section?.id, formData),
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Section updated successfully",
      description: "Your section has been updated!",
    },
  });

  if (!section) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="edit-section-dialog-trigger" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Section</DialogTitle>
          <DialogDescription>Update the details of this section.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
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
                {form.formState.isPending ? "Updating..." : "Update Section"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
