import { ExternalLink, MapPin } from "lucide-react";
import type { Locale } from "@/lib/locale";

const t = {
  title: { en: "Location", ar: "الموقع" },
  directions: { en: "Get directions", ar: "احصل على الاتجاهات" },
  map: { en: "School location on Google Maps", ar: "موقع المدرسة على خرائط جوجل" },
};

export default function LocationCard({
  address,
  mapsUrl,
  mapEmbedUrl,
  locale,
}: {
  address?: string | null;
  mapsUrl?: string | null;
  mapEmbedUrl?: string | null;
  locale: Locale;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-5">
      <h3 className="text-lg font-bold text-gray-900">{t.title[locale]}</h3>
      {mapEmbedUrl && (
        <iframe
          src={mapEmbedUrl}
          title={t.map[locale]}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[180px] w-full rounded-xl border-0 bg-gray-200"
        />
      )}
      {address && (
        <p className="flex items-start gap-2 text-sm text-gray-900">
          <MapPin className="mt-0.5 size-4 shrink-0 text-light-blue-800" aria-hidden />
          {address}
        </p>
      )}
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-light-blue-800 px-4 py-2.5 text-sm font-semibold text-light-blue-800 hover:bg-light-blue-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-800"
        >
          {t.directions[locale]}
          <ExternalLink className="size-4 rtl:-scale-x-100" aria-hidden />
        </a>
      )}
    </section>
  );
}
