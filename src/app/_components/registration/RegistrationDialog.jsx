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
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
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
          className={`w-full ${
            isAuthenticated ? "!max-w-[40vw]" : "!max-w-[80vw]"
          } h-[85vh] max-h-[90vh] overflow-y-auto`}
        >
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-4xl font-semibold leading-3 text-center">
              Get Started
            </DialogTitle>
            <DialogDescription className="font-light text-center text-lg mt-2">
              Create your first workspace to get started.
            </DialogDescription>
          </DialogHeader>

          {form.formState.errors._form && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{form.formState.errors._form[0]}</AlertDescription>
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
                <div className="grid grid-cols-1 gap-10 w-full md:grid-cols-2">
                  <div className="space-y-4 border-r border-gray-200 pr-8">
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
                  className="min-w-[220px]"
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
      <DialogContent className="!max-w-[56vw] h-[78vh] p-0 overflow-hidden border border-border shadow-2xl rounded-2xl">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-primary/15 via-primary/10 to-transparent">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(60rem_30rem_at_20%_-10%,theme(colors.primary/0.2),transparent)]" />
          <div className="px-8 pt-10 pb-6 text-center">
            <DialogHeader className="text-center">
              <DialogTitle className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                Registration Pending
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative">
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary/25 blur-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  className="relative grid place-items-center w-24 h-24 rounded-full bg-background border border-border"
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
                  <AlertCircle className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 md:px-12 py-8 md:py-10 text-center space-y-5">
          <p className="text-2xl md:text-3xl font-semibold">Thank you for your registration!</p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            We&apos;ll review your information and send a confirmation email once your workspace is
            approved. This process typically takes 24–48 hours.
          </p>

          {!isAuthenticated && (
            <div className="mx-auto max-w-xl">
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 bg-background/60">
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-sm md:text-base font-medium text-amber-700 dark:text-amber-400">
                  Please sign in to get notified when your workspace is approved
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-center">
            <Button
              onClick={handleClose}
              size="lg"
              className="min-w-[200px] shadow-sm hover:shadow-md transition-shadow"
            >
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
