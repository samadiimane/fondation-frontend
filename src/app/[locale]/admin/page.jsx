"use client";

import {useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

const AdminHome = () => {
  const t = useTranslations("admin");
  const [loadingStats] = useState(false);
  const [loadingActivity] = useState(false);

  const stats = useMemo(
    () => [
      {key: "documents", value: null},
      {key: "journals", value: null},
      {key: "users", value: null},
      {key: "pending", value: null},
    ],
    [],
  );

  const activities = [];

  return (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold text-foreground md:text-3xl'>{t("dashboardTitle")}</h1>
        <p className='text-muted-foreground'>{t("dashboardDescription")}</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <Card key={stat.key} className='rounded-2xl border bg-card shadow-md hover:shadow-lg transition-shadow'>
            <CardHeader className='pb-1'>
              <p className='text-xs font-semibold uppercase tracking-tight text-muted-foreground'>
                {t(`stats.${stat.key}.title`)}
              </p>
              <CardDescription>{t(`stats.${stat.key}.description`)}</CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              {loadingStats ? (
                <Skeleton className='h-8 w-24 rounded-lg' />
              ) : stat.value !== null ? (
                <p className='text-3xl font-semibold text-foreground'>{stat.value}</p>
              ) : (
                <p className='text-sm text-muted-foreground'>{t("stats.noData")}</p>
              )}
            </CardContent>
          </Card>
        ))}

        <Card className='rounded-2xl border bg-card shadow-md md:col-span-2 xl:col-span-4'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-semibold uppercase tracking-tight text-muted-foreground'>
              {t("activity.title")}
            </CardTitle>
            <CardDescription>{t("activity.description")}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {loadingActivity ? (
              <div className='space-y-3'>
                {Array.from({length: 3}).map((_, index) => (
                  <Skeleton key={index} className='h-12 w-full rounded-lg' />
                ))}
              </div>
            ) : activities.length ? (
              <ul className='space-y-3'>
                {activities.map((activity) => (
                  <li key={activity.id} className='rounded-lg border border-border/60 bg-muted/40 p-3'>
                    <p className='text-sm font-medium text-foreground'>{activity.title}</p>
                    <p className='text-xs text-muted-foreground'>{activity.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-muted-foreground'>{t("activity.empty")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
