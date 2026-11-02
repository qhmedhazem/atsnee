import React from "react";
import type { Metadata } from "next";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import { heroMeta } from "@/lib/pageMeta";
import { FRAME } from "@/lib/layout";
import { activeClasses, type HoursRow } from "@/lib/contact";
import ImageHeader from "@/blocks/ImageHeader";
import ContactPerson from "@/components/contact/ContactPerson";
import ContactForm from "@/components/contact/ContactForm";
import WorkingHours from "@/components/contact/WorkingHours";
import LocationCard from "@/components/contact/LocationCard";
import ContactFaq from "@/components/contact/ContactFaq";

const t = {
  who: { en: "Who to contact", ar: "بمن تتواصل" },
  whoIntro: {
    en: "Reach the principal for official matters, or your child's class counselor for anything about their studies and wellbeing.",
    ar: "تواصل مع مدير المدرسة في الشؤون الرسمية، أو مع مشرف دفعة ابنك في كل ما يخص دراسته وأحواله.",
  },
  faq: { en: "Frequently asked questions", ar: "الأسئلة الشائعة" },
  faqIntro: { en: "Your question might already be answered here.", ar: "ربما تجد إجابة سؤالك هنا." },
};

const SectionTitle = ({ title, intro }: { title: string; intro?: string }) => (
  <div className="flex flex-col gap-1">
    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
    {intro && <p className="text-gray-700">{intro}</p>}
  </div>
);

// Everything comes from the contact-page global; the form posts to /api/contact.
export default async function ContactPage() {
  const locale = await getLocale();
  const g = await payload.findGlobal({ slug: "contact-page", locale, depth: 1 });
  const counselors = (g.counselors ?? [])
    .map((c) => ({ ...c, active: activeClasses(c.classes) }))
    // Hide a counselor only when every class they follow has graduated.
    .filter((c) => !c.classes?.length || c.active.length > 0);
  const hours = (g.workingHours ?? []) as HoursRow[];

  return (
    // Same wrapper as CMS pages (RenderPageLayout): centers each section.
    <main className="flex min-h-screen flex-col items-center">
      <ImageHeader {...g.hero} size="compact" />
      <div className={`${FRAME} flex flex-col gap-16 pb-16 pt-12`}>
        <section className="flex flex-col gap-6">
          <SectionTitle title={t.who[locale]} intro={t.whoIntro[locale]} />
          {g.principal?.name && <ContactPerson person={g.principal} locale={locale} featured />}
          {counselors.length > 0 && (
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
              {counselors.map((c) => (
                <ContactPerson key={c.id} person={c} classes={c.active} locale={locale} />
              ))}
            </div>
          )}
        </section>

        {/* items-start: each column keeps its own height (a stretched form panel leaves an empty box). */}
        <section className="grid items-start gap-6 min-[980px]:grid-cols-[1.35fr_1fr]">
          <ContactForm locale={locale} replyTime={g.replyTime} />
          <aside className="grid content-start gap-6 min-[640px]:grid-cols-2 min-[980px]:grid-cols-1">
            {hours.length > 0 && <WorkingHours hours={hours} note={g.hoursNote} locale={locale} />}
            <LocationCard address={g.address} mapsUrl={g.mapsUrl} mapEmbedUrl={g.mapEmbedUrl} locale={locale} />
          </aside>
        </section>

        {!!g.faq?.length && (
          <section className="flex flex-col gap-6">
            <SectionTitle title={t.faq[locale]} intro={t.faqIntro[locale]} />
            <ContactFaq items={g.faq} />
          </section>
        )}
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await payload.findGlobal({ slug: "contact-page", locale: await getLocale(), depth: 1 });
  return heroMeta(hero);
}
