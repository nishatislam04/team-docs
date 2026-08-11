import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { RegistrationUserSchema } from "@/lib/schemas/UserSchema";
import { RegistrationWorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { registerNewUser } from "@/system/Actions/RegistrationAction";
import useRegistrationStore from "../store/useRegistrationStore";

export default function RegistrationDialog({ isAuthenticated }) {
  const { isFormDialogOpen, closeFormDialog, setRegistrationSuccess } = useRegistrationStore();

  const defaultValues = useMemo(() => {
    if (isAuthenticated)
      return {
        workspaceName: "",
        workspaceDescription: "",
      };

    return {
      username: "",
      email: "",
      password: "",
      workspaceName: "",
      workspaceDescription: "",
    };
  }, [isAuthenticated]);

  const registrationSchema = useMemo(() => {
    if (isAuthenticated)
      return z.object({
        workspaceName: RegistrationWorkspaceSchema.shape.name,
        workspaceDescription: RegistrationWorkspaceSchema.shape.description,
      });

    return z.object({
      username: RegistrationUserSchema.shape.username,
      email: RegistrationUserSchema.shape.email,
      password: RegistrationUserSchema.shape.password,
      workspaceName: RegistrationWorkspaceSchema.shape.name,
      workspaceDescription: RegistrationWorkspaceSchema.shape.description,
    });
  }, [isAuthenticated]);

  const form = useServerFormAction({
    schema: registrationSchema,
    actionFn: registerNewUser,
    onSuccess: (redirectTo, data) => setRegistrationSuccess(data),
    defaultValues,
    isDialogOpen: isFormDialogOpen,
    successToast: null,
  });

  return (
    <>
      <PendingConfirmationDialog isAuthenticated={isAuthenticated} />
      <Dialog open={isFormDialogOpen} onOpenChange={closeFormDialog}>
        <DialogContent
          className={
            isAuthenticated
              ? "h-[85vh] max-h-[90vh] w-[95vw] max-w-[95vw] overflow-y-auto p-4 sm:p-6 lg:max-w-[40vw]"
              : "h-[85vh] max-h-[90vh] w-[95vw] max-w-[95vw] overflow-y-auto p-4 sm:p-6 lg:max-w-[80vw]"
          }
        >
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-center text-2xl font-semibold leading-tight sm:text-4xl">
              Get Started
            </DialogTitle>
            <DialogDescription className="mt-2 text-center text-base font-light sm:text-lg">
              Create your first workspace to get started.
            </DialogDescription>
          </DialogHeader>

          {form.formState.errors._form && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{form.formState.errors._form.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.onSubmit} className="space-y-12">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <h3 className="pb-2 text-xl font-semibold border-b">Workspace Information</h3>
                  <FormField
                    control={form.control}
                    name="workspaceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Team" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workspaceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="A brief description of your team or organization"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
                  <div className="space-y-4 border-border lg:border-r lg:pr-8">
                    <h3 className="pb-2 text-xl font-semibold border-b">User Information</h3>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••••" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="pb-2 text-xl font-semibold border-b">Workspace Information</h3>
                    <FormField
                      control={form.control}
                      name="workspaceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workspace Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Team" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workspaceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Description <span className="text-muted-foreground">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief description of your team or organization"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={form.isSubmitDisabled}
                  className="w-full min-w-0 sm:w-auto sm:min-w-[220px]"
                >
                  {form.formState.isSubmitting
                    ? "Processing..."
                    : isAuthenticated
                      ? "Create Workspace"
                      : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PendingConfirmationDialog({ isAuthenticated }) {
  const { isPendingDialogOpen, closePendingDialog, resetRegistrationState } =
    useRegistrationStore();

  const handleClose = () => {
    resetRegistrationState();
    closePendingDialog();
  };

  return (
    <Dialog open={isPendingDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[92vh] w-[95vw] max-w-[95vw] overflow-x-hidden overflow-y-auto rounded-2xl border border-border p-0 shadow-2xl sm:max-w-lg md:max-w-2xl lg:max-w-[56vw]">
        <div className="relative isolate overflow-visible bg-gradient-to-br from-primary/15 via-primary/10 to-transparent">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(60rem_30rem_at_20%_-10%,theme(colors.primary/0.2),transparent)]" />
          <div className="px-4 pt-8 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-6">
            <DialogHeader className="text-center">
              <DialogTitle className="text-center text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Registration Pending
              </DialogTitle>
            </DialogHeader>
            <div className="mt-5 flex items-center justify-center sm:mt-6">
              <div className="relative">
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary/25 blur-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  className="relative grid size-16 place-items-center rounded-full border border-border bg-background sm:size-24"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59,130,246,0.25)",
                        "0 0 0 14px rgba(59,130,246,0)",
                        "0 0 0 0 rgba(59,130,246,0)",
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
                  />
                  <AlertCircle className="size-8 text-primary sm:size-12" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 py-5 text-center sm:space-y-5 sm:px-8 sm:py-8 md:px-12 md:py-10">
          <p className="text-xl font-semibold sm:text-2xl md:text-3xl">
            Thank you for your registration!
          </p>
          <p className="text-muted-foreground mx-auto max-w-2xl text-balance text-sm sm:text-base">
            We&apos;ll review your information and send a confirmation email once your workspace is
            approved. This process typically takes 24–48 hours.
          </p>

          {!isAuthenticated && (
            <div className="mx-auto w-full max-w-xl">
              <div className="mt-2 flex w-full items-start gap-2.5 rounded-2xl border bg-background/60 px-3 py-2.5 sm:rounded-full sm:px-4 sm:py-2">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-amber-500 animate-pulse sm:mt-0 sm:self-center" />
                <p className="text-left text-sm font-medium text-amber-700 dark:text-amber-400 sm:text-center sm:text-base">
                  Please sign in to get notified when your workspace is approved
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2 sm:pt-4">
            <Button
              onClick={handleClose}
              size="lg"
              className="w-full shadow-sm transition-shadow hover:shadow-md sm:w-auto sm:min-w-[200px]"
            >
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
