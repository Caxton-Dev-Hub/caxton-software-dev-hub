import Script from "next/script";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSession } from "@/lib/auth";
import { site } from "@/content/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession().catch(() => null);

  const organisation = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.registration.entityName,
    alternateName: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    identifier: site.registration.number,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.street}, ${site.address.area}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      addressCountry: "NG",
    },
    sameAs: [site.socials.github, site.socials.githubAlt, site.socials.linkedin],
  };

  return (
    <>
      <SiteHeader signedIn={Boolean(session)} />
      <main id="main">{children}</main>
      <SiteFooter />
      <Script
        id="ld-organisation"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />
    </>
  );
}
