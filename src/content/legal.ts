import { site } from "@/content/site";

export type LegalDoc = {
  slug: "terms" | "privacy" | "refunds";
  title: string;
  updated: string;
  summary: string;
  body: string;
};

/**
 * DRAFT DOCUMENTS. These are a reasonable starting point written in plain
 * English, but they are not legal advice. Have a Nigerian lawyer review them
 * before launch, particularly the NDPA 2023 sections in the privacy policy.
 */
export const legalDocs: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of service",
    updated: "2026-08-01",
    summary:
      "The rules that apply when you use this website, enrol on a course, book mentorship, or engage us for a project.",
    body: `These terms apply to ${site.registration.entityName} ("we", "us"), a business name registered in Nigeria under registration number ${site.registration.number}, with its principal place of business at ${site.address.full}.

By using this website or buying anything through it, you agree to what follows. If you do not agree, please do not use the service.

## 1. Who we are

We are a software development and web design business. We also run paid training courses and mentorship programmes. Our contact address for all notices is the address above, and our email address is published on our contact page.

## 2. Accounts

You need an account to enrol on a course or book mentorship. You must give accurate information, keep your password to yourself, and tell us promptly if you think someone else has accessed your account. You are responsible for activity that happens under your account.

We may suspend or close an account that is used to break these terms, to harass another learner or member of staff, or to share paid material with people who have not paid for it.

## 3. Courses and mentorship

When you pay for a course, you receive access to that course's material and sessions for the cohort you enrolled on, plus the recordings. When you pay for mentorship, you receive the number of sessions described on the plan page for the period stated.

Course content is licensed to you personally. You may not record, redistribute, resell, or publish it. You may of course use anything you build during the course however you like — your work is yours.

We may change a cohort's schedule where we have to. If a change makes the course unusable for you, we will move you to the next cohort or refund you in full.

## 4. Payment

Prices are shown in Nigerian naira and include any applicable tax unless stated otherwise. Payments are processed by Paystack; we do not store your card details on our servers.

Instalment plans require the balance to be settled by the date stated at checkout. If the balance is not settled, access may be suspended until it is.

## 5. Refunds

Refunds are governed by our refund policy, which forms part of these terms.

## 6. Client projects

Software development engagements are governed by a separate written agreement covering scope, price, timeline, and intellectual property. Where that agreement conflicts with these terms, that agreement takes precedence.

Unless the agreement says otherwise: you own the source code we write for you on final payment; we retain the right to describe the work publicly in general terms; and we provide 30 days of free defect fixes after go-live.

## 7. Acceptable use

Do not use our service to break the law, infringe someone's rights, distribute malware, attempt to gain unauthorised access to our systems, or scrape our content at scale.

Our AI study assistant is provided to help you learn. Attempting to use it to have your assessed work produced for you is a breach of these terms.

## 8. Availability

We try to keep the service available but we do not guarantee it will be uninterrupted. We may take it down for maintenance, ideally with notice.

## 9. Liability

Nothing in these terms excludes liability that cannot lawfully be excluded. Subject to that, our total liability to you for anything arising out of the service is limited to the amount you paid us in the twelve months before the claim arose.

We are not liable for indirect or consequential loss, including loss of profit or loss of opportunity.

## 10. Governing law

These terms are governed by the laws of the Federal Republic of Nigeria, and the courts of Kaduna State have jurisdiction over any dispute.

## 11. Changes

We may update these terms. If we make a material change, we will tell registered users by email. Continuing to use the service after a change means you accept the updated terms.`,
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "2026-08-01",
    summary:
      "What personal data we collect, why we collect it, how long we keep it, and the rights you have under the Nigeria Data Protection Act 2023.",
    body: `${site.registration.entityName} (registration number ${site.registration.number}) is the data controller for personal data collected through this website. Our address is ${site.address.full}.

This policy explains what we do with your information. We have tried to write it in plain English rather than legalese.

## What we collect

**When you contact us:** your name, email address, and anything else you choose to put in the message — usually a phone number, company name, and a description of your project.

**When you create an account:** your name, email address, an optional phone number, and a hashed version of your password. We never store your password itself.

**When you pay:** a payment reference, the amount, the status, and the payment channel. Card details go directly to Paystack and never reach our servers.

**When you use the study assistant:** the messages you send and the replies you receive, so that you can return to a conversation later.

**Automatically:** basic server logs including IP address and browser type, used for security and debugging.

## Why we use it

- To provide what you paid for — course access, mentorship sessions, and support
- To reply to your enquiry
- To take payment and keep accurate financial records
- To improve our courses and this website
- To send you service messages about your enrolment
- To meet our legal and tax obligations

We rely on performance of a contract for the first three, our legitimate interests for the next two, and legal obligation for the last. Marketing email is sent only with your consent, and every marketing email has an unsubscribe link.

## Who we share it with

We use a small number of processors, each bound by contract to protect your data:

- **Paystack** — payment processing
- **Anthropic** — the model behind the study assistant. Your conversations are sent to their API to generate replies.
- **Resend** — transactional email delivery
- **Our hosting provider** — running the site and database

We do not sell your personal data. We do not share it with advertisers.

## Transfers outside Nigeria

Some of the processors above operate outside Nigeria. Where data is transferred internationally, we rely on the safeguards permitted under the Nigeria Data Protection Act 2023, including contractual protections with each processor.

## How long we keep it

Account and enrolment records: for as long as your account is open, and seven years after that where financial records require it. Contact enquiries: two years. Study assistant conversations: until you delete them or close your account. Server logs: 90 days.

## Your rights

Under the Nigeria Data Protection Act 2023 you have the right to request a copy of your data, to have inaccurate data corrected, to ask us to delete data we no longer need, to object to processing based on legitimate interests, and to withdraw consent for marketing at any time.

To exercise any of these, email us at the address on our contact page. We will respond within 30 days. If you are unsatisfied with our response, you can complain to the Nigeria Data Protection Commission.

## Cookies

We use one strictly necessary cookie to keep you signed in. We do not use advertising or third-party tracking cookies.

## Security

Passwords are hashed with bcrypt. Traffic is encrypted in transit. Access to production data is limited to the people who need it. No system is perfectly secure, but if a breach affects you we will tell you and the Commission as required by law.

## Changes

If we change this policy materially, we will email registered users and update the date at the top.`,
  },
  {
    slug: "refunds",
    title: "Refund policy",
    updated: "2026-08-01",
    summary:
      "When you can get your money back on a course, a mentorship plan, or a project deposit — stated plainly, so you can decide before you pay.",
    body: `We would rather you knew the refund position before you paid than argued about it afterwards. This policy forms part of our terms of service.

## Cohort courses

**More than seven days before the cohort starts:** full refund, no questions asked. Email us and we will process it within five working days.

**Within seven days of the start, or during the first two weeks:** 50% refund. The remaining 50% covers the seat we held and the material already released.

**After week two:** no refund. You may, however, transfer your seat to the next cohort once at no charge, provided you ask before the cohort ends.

**If we cancel or reschedule a cohort:** full refund, or a free transfer to the next cohort — your choice.

## Self-paced courses

**Within seven days of purchase, and if you have completed less than 20% of the lessons:** full refund.

**After that:** no refund, because the material has been delivered.

## Instalment plans

The first instalment follows the same rules as a full payment. If you cancel after paying only the first instalment, the balance is not owed but the seat is released.

## Mentorship

**Monthly plans:** cancel any time before your next renewal date. We do not refund part-used months, but we also do not charge you again — there is no automatic renewal.

**Career Sprint (fixed eight weeks):** full refund before the first session. After the first session, a pro-rata refund for the sessions not yet delivered, up to week four. After week four, no refund.

**If your mentor becomes unavailable:** we will assign another mentor of equivalent seniority, or refund the undelivered sessions in full if you prefer.

## Client projects

Project deposits are governed by the signed agreement for that project. Our standard terms: the discovery fee is non-refundable once discovery has taken place, and stage payments are non-refundable once that stage has been delivered and approved. Work not yet started is always refundable.

## How to request a refund

Email us from the address on your account with your name, what you bought, and the reason. We respond within two working days and process approved refunds within five.

Refunds are returned by the same method you paid with. Paystack usually returns funds to a Nigerian card within a few working days, though the exact timing is up to your bank.

## If you are unhappy

Ask us first. Most refund requests come from a problem we could have solved — the wrong course level, a scheduling clash, an unclear expectation. We would rather fix it than lose you.`,
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
