"use client";

import {useToast} from "@/components/ui/use-toast";

const isDev = process.env.NODE_ENV !== "production";

const useNotify = () => {
  const {toast} = useToast();

  const emit = (description, variant = "default") =>
    toast({
      description,
      variant,
    });

  const notify = {
    success: (message) => emit(message, "default"),
    info: (message) => emit(message, "default"),
    error: (message) => emit(message, "destructive"),
    handleError: (error, fallbackMessage, options = {}) => {
      if (!error || error.name === "AbortError") {
        return;
      }

      if (isDev) {
        // eslint-disable-next-line no-console
        console.debug("[admin.notify]", error);
      }

      const messageFallback = fallbackMessage || "Request failed. Please try again.";

      if (error.code === "SESSION_EXPIRED" || error?.status === 401) {
        options.onSessionExpired?.();
        notify.error(options.sessionExpiredMessage || "Session expired.");
        return;
      }

      if (error.code === "FORBIDDEN" || error?.status === 403) {
        notify.error(options.forbiddenMessage || "Not authorized for this action.");
        return;
      }

      if (error.code === "NETWORK_ERROR") {
        notify.error(options.networkMessage || "Network problem, please retry.");
        return;
      }

      if (typeof error.userMessage === "string" && error.userMessage.trim().length > 0) {
        notify.error(error.userMessage);
        return;
      }

      notify.error(messageFallback);
    },
  };

  return notify;
};

export default useNotify;
