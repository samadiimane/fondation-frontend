"use client";

import {cn} from "@/lib/utils";

export const Card = ({className, ...props}) => (
  <div
    className={cn(
      "rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50",
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({className, ...props}) => (
  <div className={cn("px-6 pt-6", className)} {...props} />
);

export const CardTitle = ({className, ...props}) => (
  <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
);

export const CardDescription = ({className, ...props}) => (
  <p className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)} {...props} />
);

export const CardContent = ({className, ...props}) => (
  <div className={cn("px-6 pb-6 text-sm text-neutral-600 dark:text-neutral-300", className)} {...props} />
);
