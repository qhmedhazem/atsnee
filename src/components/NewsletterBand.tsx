import SubscribeForm from "@/components/SubscribeForm";

interface Props {
  title?: string | null;
  text?: string | null;
  placeholder?: string | null;
  buttonLabel?: string | null;
}

// Blue newsletter band: the homepage block design, also shown site-wide above the footer.
export default function NewsletterBand({ title, text, placeholder, buttonLabel }: Props) {
  return (
    <section className="w-full bg-light-blue-800 text-white">
      <div className="container flex flex-col items-center gap-8 py-20 text-center md:py-24">
        {(title || text) && (
          <div className="max-w-2xl space-y-3">
            {title && <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">{title}</h2>}
            {text && <p className="text-white/85">{text}</p>}
          </div>
        )}
        <SubscribeForm endpoint="/api/newsletter/subscribe" placeholder={placeholder} buttonLabel={buttonLabel} />
      </div>
    </section>
  );
}
