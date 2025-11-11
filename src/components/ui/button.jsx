"use client";

import {cn} from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-400",
  outline:
    "border border-neutral-300 text-neutral-800 hover:bg-neutral-100 focus-visible:ring-neutral-300 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
  destructive:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400 dark:bg-red-500 dark:hover:bg-red-400",
};

const sizes = {
  sm: "h-8 px-4",
  md: "h-10 px-5",
};

export const Button = ({variant = "primary", size = "md", className, ...props}) => (
  <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
);

export default Button;
