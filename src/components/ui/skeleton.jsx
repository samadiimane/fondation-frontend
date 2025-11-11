"use client";

import {cn} from "@/lib/utils";

export const Skeleton = ({className, ...props}) => (
  <div className={cn("h-4 w-full animate-pulse rounded-md bg-neutral-200/80 dark:bg-neutral-800/80", className)} {...props} />
);
