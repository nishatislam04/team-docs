import { useToast } from "@/hooks/useToast";
import Logger from "@/lib/Logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export function useServerFormAction({
  schema,
  actionFn,
  defaultValues,
  onSuccess,
  onError,
  onStart,
  optimistic,
  isDialogOpen = null,
  successToast = {
    title: "Action successful",
    description: "Your request was completed successfully.",
  },
}) {
  const toast = useToast();
  const [errors, setErrors] = useState({});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange", // validate on every input change
    reValidateMode: "onChange",
  });

  const { control, reset, setError, handleSubmit, formState } = form;

  // Watches all form values reactively
  const values = useWatch({ control });

  // Reset form whenever dialog opens
  useEffect(() => {
    if (isDialogOpen !== null && isDialogOpen) {
      reset(defaultValues);
    }
  }, [isDialogOpen, reset, defaultValues]);

  // Check if form is entirely empty
  const isFormEmpty = useMemo(() => {
    return Object.values(values || {}).every(
      (value) => value === "" || value === null || value === undefined
    );
  }, [values]);

  // Compute disabled state for submit button
  const isSubmitDisabled =
    !formState.isValid || // fails zod validation
    isFormEmpty ||
    !form.formState.isDirty || // nothing changed from default
    formState.isSubmitting;

  // ---- internal helpers (kept inside hook for closure access) ----
  const fireOnStart = (formData) => {
    try {
      onStart?.(formData);
    } catch (e) {
      Logger.error(e, "onStart threw an error");
    }
  };

  const runOptimisticStart = async (formData) => {
    if (!optimistic?.start) return null;
    try {
      return await optimistic.start(formData);
    } catch (e) {
      Logger.error(e, "optimistic.start failed");
      return null;
    }
  };

  const applyServerErrors = (result) => {
    // Set field-level errors
    Object.entries(result.errors || {}).forEach(([key, msg]) => {
      setError(key, {
        type: "server",
        message: Array.isArray(msg) ? msg[0] : msg,
      });
    });
    setErrors(result.errors);
    onError?.(result.errors);
  };

  const runOptimisticRevert = async (optimisticContext, errorResult) => {
    if (!optimistic?.revert) return;
    try {
      await optimistic.revert(optimisticContext, errorResult);
    } catch (e) {
      Logger.error(e, "optimistic.revert failed");
    }
  };

  const runOptimisticCommit = async (optimisticContext, data) => {
    if (!optimistic?.commit) return;
    try {
      await optimistic.commit(optimisticContext, data);
    } catch (e) {
      Logger.error(e, "optimistic.commit failed");
    }
  };

  const handleSuccess = (result) => {
    if (successToast !== null) toast.success(successToast?.title, successToast?.description);
    reset();
    onSuccess?.(result.redirectTo, result.data);
  };

  const onSubmit = handleSubmit(async (formData) => {
    // Non-optimistic pre-submit hook
    fireOnStart(formData);

    // Optimistic start -> returns context for commit/revert
    const optimisticContext = await runOptimisticStart(formData);

    const result = await actionFn(formData);

    if (result?.success === false) {
      Logger.error(result, "result in server form action");
      applyServerErrors(result);
      await runOptimisticRevert(optimisticContext, result);
      return;
    }

    if (result?.type === "success") {
      await runOptimisticCommit(optimisticContext, result.data);
      handleSuccess(result);
    }
  });

  return {
    ...form,
    onSubmit,
    isSubmitDisabled,
    errors,
  };
}
