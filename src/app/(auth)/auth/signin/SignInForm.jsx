"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signin } from "./signinAction";
import { signInSchema } from "./signinSchema";

export default function SignInForm() {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await signin(data);

      if (result.type === "success") {
        window.location.href = "/"; // we wont use router as our root page is cached.
      } else if (result.type === "error" || result.type === "fail") {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            form.setError(field, {
              type: "server",
              message: Array.isArray(message) ? message[0] : message,
            });
          });
        }
        form.setValue("password", "");
      }
    } catch (error) {
      console.error("Signin error:", error);
      form.setError("_form", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="h-12 text-lg"
                    {...field}
                    onChange={(e) => {
                      form.clearErrors("email");
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 text-lg"
                    {...field}
                    onChange={(e) => {
                      form.clearErrors("password");
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          {form.formState.errors._form && (
            <div className="space-y-1 text-sm text-destructive">
              <p>{form.formState.errors._form.message}</p>
            </div>
          )}

          <SubmitButton isPending={form.formState.isSubmitting} />

          <div className="pt-4 text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SubmitButton({ isPending }) {
  return (
    <Button type="submit" className="h-12 w-full text-lg font-semibold" disabled={isPending}>
      {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      Sign In
    </Button>
  );
}
