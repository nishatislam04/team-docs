"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { assignPermissionsToRole } from "@/system/Actions/RolePermissionAssignActions";
import { Loader2 } from "lucide-react";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { RolePermissionAssignSchema } from "@/lib/schemas/RolePermissionAssignSchema";
import { useRolePermissions } from "./hooks/useRolePermissions";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RolePermissionDialog({ isOpen, onOpenChange, roleId }) {
  const defaultValues = useMemo(
    () => ({
      roleId,
      permissions: [],
    }),
    [roleId]
  );

  const handleSuccess = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const form = useServerFormAction({
    schema: RolePermissionAssignSchema,
    defaultValues,
    actionFn: (formData) => assignPermissionsToRole(roleId, formData),
    onSuccess: handleSuccess,
    isDialogOpen: isOpen,
    successToast: {
      title: "Permissions assigned successfully",
      description: "Your new role-permission is ready to use!",
    },
  });

  const { permissions, showSkeleton } = useRolePermissions(roleId, isOpen, form.reset);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[1000px] p-10 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold">Assign Permissions</DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Choose the permissions you want to assign to this role.
          </DialogDescription>
        </DialogHeader>

        {showSkeleton ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4 p-4 border rounded-xl">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            <p className="text-xl font-medium text-muted-foreground">Fetching permissions...</p>
          </div>
        ) : permissions.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-start space-y-4 p-4 border-2 border-dashed rounded-xl text-center ">
            <div className="flex flex-col items-center justify-center w-full gap-3 h-1/2">
              <h2 className="text-2xl font-bold text-muted-foreground">No Permissions Found</h2>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.onSubmit} className="w-full mt-6 space-y-5">
              <input type="hidden" name="roleId" value={roleId} />

              <ScrollArea className="h-[400px] rounded-md border">
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem className="flex gap-6 flex-wrap p-2">
                      {permissions.map((permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={permission.id}
                                className="bg-gray-100 w-70 p-4 flex items-center gap-2 rounded-lg"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permission.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, permission.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== permission.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal w-full">
                                  {permission.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ScrollArea>

              <GeneralFormErrorDispaly form={form} />

              <DialogFooter className="pt-6">
                <Button
                  type="submit"
                  disabled={form.isSubmitDisabled}
                  className="px-8 text-lg font-semibold h-14"
                >
                  {form.formState.isSubmitting ? "Assigning..." : "Assign Selected Permissions"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
