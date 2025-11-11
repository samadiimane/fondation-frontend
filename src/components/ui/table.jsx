"use client";

import {cn} from "@/lib/utils";

export const Table = ({className, children, ...props}) => (
  <div className='relative w-full overflow-auto'>
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({className, children, ...props}) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({className, children, ...props}) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({className, children, ...props}) => (
  <tr className={cn("border-b transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/40", className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({className, children, ...props}) => (
  <th className={cn("h-10 px-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500", className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({className, children, ...props}) => (
  <td className={cn("px-4 py-3 align-middle text-sm text-neutral-700 dark:text-neutral-200", className)} {...props}>
    {children}
  </td>
);
