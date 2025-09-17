"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

import { signup } from "./signupAction";
import { signUpSchema } from "./signupSchema";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await signup(data);

      if (result.type === "success") {
        window.location.href = "/"; // Root page may be cached, do a hard navigation
        return;
      }

      if (result.type === "error" || result.type === "fail") {
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
      console.error("signup error (client):", error);
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    className="h-12 text-lg"
                    {...field}
                    onChange={(e) => {
                      form.clearErrors("username");
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pr-10 text-lg"
                      {...field}
                      onChange={(e) => {
                        form.clearErrors("password");
                        field.onChange(e);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          {form.formState.errors._form && (
            <div className="space-y-1 text-sm text-red-500">
              <p>{form.formState.errors._form.message}</p>
            </div>
          )}

          <SubmitButton
            isPending={form.formState.isSubmitting}
            isDisabled={form.formState.isSubmitting || !form.formState.isValid}
          />

          <div className="pt-4 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SubmitButton({ isPending, isDisabled }) {
  return (
    <Button type="submit" className="h-12 w-full text-lg font-semibold" disabled={isDisabled}>
      {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      {isPending ? "Creating..." : "Create Account"}
    </Button>
  );
}
