"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import {
  changePassword,
  updateProfile,
  type ActionState,
} from "@/app/dashboard/settings/actions";

const initial: ActionState = {};

function Notice({ state }: { state: ActionState }) {
  if (state.ok) {
    return (
      <p className="flex items-center gap-2 text-[0.875rem] text-forest">
        <Check className="size-4 text-signal" /> {state.ok}
      </p>
    );
  }
  if (state.error) {
    return (
      <p
        className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700"
        role="alert"
      >
        {state.error}
      </p>
    );
  }
  return null;
}

export function SettingsForms({
  defaults,
}: {
  defaults: { name: string; phone: string; bio: string };
}) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    initial,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePassword,
    initial,
  );

  return (
    <div className="space-y-6">
      <form action={profileAction} className="rounded-lg border border-edge bg-paper p-6">
        <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          Your details
        </h2>

        <div className="mt-5 space-y-4">
          <Field label="Full name" htmlFor="name">
            <Input id="name" name="name" defaultValue={defaults.name} required />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone} />
          </Field>
          <Field
            label="About you"
            htmlFor="bio"
            hint="Your mentor reads this before your first call."
          >
            <Textarea id="bio" name="bio" defaultValue={defaults.bio} maxLength={500} />
          </Field>
          <Notice state={profileState} />
          <Button type="submit" disabled={profilePending}>
            {profilePending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>

      <form action={passwordAction} className="rounded-lg border border-edge bg-paper p-6">
        <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          Password
        </h2>

        <div className="mt-5 space-y-4">
          <Field label="Current password" htmlFor="current">
            <Input
              id="current"
              name="current"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          <Field label="New password" htmlFor="next" hint="At least 10 characters.">
            <Input
              id="next"
              name="next"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
            />
          </Field>
          <Notice state={passwordState} />
          <Button type="submit" variant="secondary" disabled={passwordPending}>
            {passwordPending ? "Updating…" : "Change password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
