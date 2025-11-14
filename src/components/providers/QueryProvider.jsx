"use client";

import {useState} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import dynamic from "next/dynamic";

import {getQueryClient} from "@/lib/queryClient";

const isDev = process.env.NODE_ENV !== "production";
const ReactQueryDevtools = isDev
  ? dynamic(() => import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools), {
      ssr: false,
    })
  : null;

const QueryProvider = ({children}) => {
  const [client] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      {isDev && ReactQueryDevtools ? (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      ) : null}
    </QueryClientProvider>
  );
};

export default QueryProvider;

