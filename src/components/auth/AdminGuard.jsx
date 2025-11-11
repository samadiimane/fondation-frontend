"use client";

import {useMemo} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import useAuth from "@/hooks/useAuth";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const AdminGuard = ({children}) => {
  const t = useTranslations("admin");
  let authState = null;
  try {
    authState = useAuth();
  } catch (error) {
    authState = null;
  }

  const loading = Boolean(authState?.initializing ?? authState?.loading);
  const isAuthenticated = Boolean(authState?.isAuthenticated);
  const roles = Array.isArray(authState?.roles) ? authState.roles : [];
  const isAdmin = roles.includes("admin");

  const loadingNode = useMemo(
    () => (
      <div className='flex min-h-[40vh] items-center justify-center px-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>{t("loading")}</CardTitle>
          </CardHeader>
          <CardContent>{t("loading")}</CardContent>
        </Card>
      </div>
    ),
    [t],
  );

  if (loading) {
    return loadingNode;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <section className='mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center' aria-live='polite'>
        <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-50'>{t("notAuthorizedTitle")}</h2>
        <p className='text-neutral-600 dark:text-neutral-300'>{t("notAuthorizedDescription")}</p>
        <Link
          href='/'
          className='btn--secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide'
        >
          {t("backToHome")}
        </Link>
      </section>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
