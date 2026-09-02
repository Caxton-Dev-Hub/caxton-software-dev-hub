"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  UsersRound,
  ClipboardList,
  ClipboardCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

const studentLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/courses", label: "My courses", icon: BookOpen },
  { href: "/dashboard/mentorship", label: "Mentorship", icon: UsersRound },
  { href: "/dashboard/assistant", label: "Study assistant", icon: Sparkles },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// `marker: true` marks the pages a MENTOR may open. Everything else in the
// admin area is money and pipeline, which a mentor has no business seeing.
const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/submissions", label: "Marking", icon: ClipboardCheck, marker: true },
  { href: "/admin/enrollments", label: "Enrolments", icon: BookOpen },
  { href: "/admin/bookings", label: "Mentorship", icon: UsersRound },
  { href: "/admin/waitlist", label: "Waitlist", icon: ClipboardList },
  { href: "/admin/leads", label: "Enquiries", icon: Shield },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export type NavRole = "STUDENT" | "MENTOR" | "ADMIN";

export function DashboardNav({
  area,
  role,
}: {
  area: "student" | "admin";
  role: NavRole;
}) {
  const pathname = usePathname();
  const canMark = role === "MENTOR" || role === "ADMIN";
  const links =
    area === "admin"
      ? adminLinks.filter((link) => role === "ADMIN" || link.marker)
      : studentLinks;

  return (
    <nav className="space-y-1" aria-label={area === "admin" ? "Admin" : "Dashboard"}>
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.9375rem] transition-colors",
              active
                ? "bg-mint text-forest-deep"
                : "text-ink-soft hover:bg-mist hover:text-ink",
            )}
          >
            <link.icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}

      {canMark ? (
        <Link
          href={
            area === "admin"
              ? "/dashboard"
              : role === "ADMIN"
                ? "/admin"
                : "/admin/submissions"
          }
          className="mt-4 flex items-center gap-3 rounded-md border border-edge px-3 py-2.5 text-[0.9375rem] text-ink-soft transition-colors hover:border-forest hover:text-forest"
        >
          <Shield className="size-4 shrink-0" />
          {area === "admin"
            ? "Student view"
            : role === "ADMIN"
              ? "Admin area"
              : "Marking"}
        </Link>
      ) : null}
    </nav>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[0.9375rem] text-ink-soft transition-colors hover:bg-mist hover:text-ink disabled:opacity-60"
    >
      <LogOut className="size-4 shrink-0" />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
