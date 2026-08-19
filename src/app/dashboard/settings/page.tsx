import Link from "next/link";

import { PageTitle } from "@/components/app-shell";
import { SettingsForms } from "@/components/settings-forms";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <>
      <PageTitle
        eyebrow="Account"
        title="Settings"
        lead="Your details and your password. Email changes need to go through us — message support and we will verify and switch it."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsForms
          defaults={{
            name: user.name,
            phone: user.phone ?? "",
            bio: user.bio ?? "",
          }}
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-edge bg-paper p-6">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
              Account
            </h2>
            <dl className="mt-4 space-y-3 text-[0.9375rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-faint">Email</dt>
                <dd className="text-ink">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-faint">Role</dt>
                <dd className="text-ink capitalize">{user.role.toLowerCase()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-faint">Member since</dt>
                <dd className="text-ink">{formatDate(user.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-edge bg-paper p-6">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
              Deleting your account
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              Email us from this address and we will delete your account and
              personal data within 30 days, keeping only the financial records we
              are legally required to retain. See the{" "}
              <Link href="/legal/privacy" className="underline underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
