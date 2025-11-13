"use client";

import {useMemo} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import useAuth from "@/hooks/useAuth";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const AdminGuard = ({children}) => {
  const t = useTranslations("admin");
  const locale = useLocale();
  let authState = null;
  try {
    authState = useAuth();
  } catch {
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
      <section
        className='mx-auto flex h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center'
        aria-live='polite'
      >
        <h2 className='text-lg font-semibold text-foreground'>{t("notAuthorizedTitle")}</h2>
        <p className='text-sm text-muted-foreground max-w-md'>{t("notAuthorizedDescription")}</p>
        <Button asChild>
          <Link href={`/${locale}`}>{t("backToHome")}</Link>
        </Button>
      </section>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
