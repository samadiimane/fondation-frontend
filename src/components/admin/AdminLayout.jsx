"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import {useQueryClient} from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAdminCapabilities from "@/hooks/useAdminCapabilities";
import AdminGuard from "@/components/auth/AdminGuard";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {Toaster} from "@/components/ui/toaster";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {ADMIN_CAPABILITIES_QUERY_KEY, getAdminCapabilities} from "@/lib/api/adminCapabilities";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Command as CommandIcon,
  FileText,
  FolderTree,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  {key: "dashboard", icon: LayoutDashboard, href: "/admin", disabled: false},
  {key: "users", icon: Users, href: "/admin/users", disabled: false},
  {
    key: "authors",
    icon: UserRound,
    href: "/admin/authors",
    disabled: false,
    requires: (caps) => caps?.authors?.list !== false,
  },
  {key: "categories", icon: FolderTree, href: "/admin/categories", disabled: false},
  {key: "content", icon: FileText, href: "/admin/content", disabled: true},
  {key: "settings", icon: Settings, href: "/admin/settings", disabled: true},
];

const AdminShell = ({children}) => {
  const locale = useLocale();
  const t = useTranslations("admin.nav");
  const router = useRouter();
  const pathname = usePathname();
  const {user, logout} = useAuth();
  const {data: adminCapabilities} = useAdminCapabilities();
  const queryClient = useQueryClient();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const prefetchedRoutesRef = useRef(new Set());

  useEffect(() => {
    const handleClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (typeof item.requires === "function") {
          return item.requires(adminCapabilities);
        }
        return true;
      }).map((item) => ({
        ...item,
        label: t(item.key),
      })),
    [adminCapabilities, t],
  );
  const availableNavItems = useMemo(
    () => navItems.filter((item) => !item.disabled),
    [navItems],
  );

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ADMIN_CAPABILITIES_QUERY_KEY,
      queryFn: ({signal}) => getAdminCapabilities({signal}),
      staleTime: 5 * 60_000,
    });
  }, [queryClient]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
        return;
      }
      if ((event.metaKey || event.ctrlKey) && ["1", "2", "3", "4"].includes(event.key)) {
        const index = Number(event.key) - 1;
        const target = availableNavItems[index];
        if (!target) return;
        event.preventDefault();
        router.push(target.href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [availableNavItems, router]);
  const normalizedPath = useMemo(() => {
    if (!pathname) return "/";
    if (locale && pathname.startsWith(`/${locale}`)) {
      const trimmed = pathname.slice(locale.length + 1) || "/";
      return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    }
    return pathname;
  }, [pathname, locale]);

  const isActive = (href) => {
    if (href === "/admin") {
      return normalizedPath === "/admin";
    }
    return normalizedPath.startsWith(href);
  };

  const initials = useMemo(() => {
    if (!user?.email) return "AD";
    return user.email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }, [user?.email]);

  const handleLogout = useCallback(() => {
    setProfileMenuOpen(false);
    logout?.();
    router.replace("/admin");
  }, [logout, router]);

  const handleCommandNavigate = useCallback(
    (href) => {
      setCommandOpen(false);
      router.push(href);
    },
    [router],
  );

  const handleCommandLogout = useCallback(() => {
    setCommandOpen(false);
    handleLogout();
  }, [handleLogout]);

  const prefetchRoute = useCallback(
    (href) => {
      if (!href || prefetchedRoutesRef.current.has(href)) return;
      const prefetcher = router?.prefetch;
      if (typeof prefetcher !== "function") {
        return;
      }

      prefetchedRoutesRef.current.add(href);
      const maybePromise = prefetcher(href);
      if (maybePromise?.catch) {
        maybePromise.catch(() => prefetchedRoutesRef.current.delete(href));
      }
    },
    [router],
  );

  const renderNavLinks = (variant = "desktop") =>
    navItems.map((item) => {
      const Icon = item.icon;
      const active = !item.disabled && isActive(item.href);
      const showLabel = variant === "mobile" || !collapsed;
      const baseClasses = cn(
        "relative flex items-center gap-3 rounded-lg px-4 py-2 text-md font-semibold transition-colors",
        collapsed && variant !== "mobile" && "justify-center px-0",
        active ? "bg-white text-blue-950 shadow-sm" : "text-white hover:bg-white/10",
        item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
      );
        const iconClasses = cn(
          "h-5 w-5 shrink-0",
          active ? "text-sky-400" : "text-white",
          item.disabled && "text-slate-500",
        );
      const content = (
        <>
          <Icon className={iconClasses} />
          {showLabel && <span className="truncate">{item.label}</span>}
          {active && !item.disabled && (
            <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-sky-400" aria-hidden />
          )}
        </>
      );

      if (item.disabled) {
        return (
          <div key={item.key} className={baseClasses}>
            {content}
          </div>
        );
      }
      return (
        <Link
          key={item.key}
          href={item.href}
          className={baseClasses}
          title={!showLabel ? item.label : undefined}
          onClick={() => {
            if (variant === "mobile") setMobileOpen(false);
          }}
          onMouseEnter={() => prefetchRoute(item.href)}
          prefetch={false}
        >
          {content}
        </Link>
      );
    });

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen">
        <aside
          className={cn(
            "hidden min-h-screen flex-col border-r border-slate-800 bg-blue-950 text-slate-100 transition-all duration-200 shadow-xl md:flex",
            collapsed ? "w-16" : "w-64",
          )}
        >
          <div className="flex h-14 items-center px-3 text-lg font-semibold tracking-tight gap-2">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
              <img src="/icon.ico" alt="AKT logo" className="h-8 w-8 object-contain" />
            </div>
            <div
              className={cn(
                "overflow-hidden",
                collapsed ? "max-w-0" : "max-w-[140px] transition-[max-width] duration-300 ease-out",
              )}
            >
              <span
                className={cn(
                  "block origin-left text-white",
                  collapsed ? "-translate-x-3 opacity-0 transition-none" : "translate-x-0 opacity-100 transition-all duration-300",
                )}
              >
                AKT Admin
              </span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-2 py-4 text-sm">{renderNavLinks()}</nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center gap-3 border-b border-border bg-white/95 px-4 shadow-sm backdrop-blur md:px-6">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:inline-flex"
                    onClick={() => setCollapsed((prev) => !prev)}
                    aria-label={collapsed ? t("expand") : t("collapse")}
                  >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{collapsed ? t("expand") : t("collapse")}</TooltipContent>
              </Tooltip>
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="border-b px-4 py-3">
                    <SheetTitle>AKT Admin</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 px-4 py-4">{renderNavLinks("mobile")}</nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-1 items-center gap-3">
              <Input
                className="w-full rounded-full border-slate-300 bg-slate-50 md:max-w-md"
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
              />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Notifications" className="text-primary">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Command menu"
                    onClick={() => setCommandOpen(true)}
                  >
                    <CommandIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Command (Cmd+K)</TooltipContent>
              </Tooltip>
              <div
                ref={profileMenuRef}
                className="relative flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-sm"
              >
                <div className="flex items-center gap-2 max-w-[180px] truncate">
                  <span className="truncate font-medium text-slate-700">{user?.email ?? "—"}</span>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    Admin
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 w-44 rounded-xl border border-border bg-background p-2 shadow-xl">
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-1 text-left text-sm text-muted-foreground hover:bg-muted"
                      disabled
                    >
                      Profile (soon)
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-1 text-left text-sm text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
              <Separator orientation="vertical" className="hidden h-6 md:block" />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder={t("searchPlaceholder")} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {availableNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem key={item.key} onSelect={() => handleCommandNavigate(item.href)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={handleCommandLogout}>
                {t("logout")}
                <CommandShortcut>Shift+Cmd+Q</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
    </div>
    </TooltipProvider>
  );
};

const AdminLayout = ({children}) => (
  <AdminGuard>
    <AdminShell>{children}</AdminShell>
  </AdminGuard>
);

export default AdminLayout;
