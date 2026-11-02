import { FC } from "react";
import { NewsLetter as NewsLetterInterface } from "@/payload-types";
import NewsletterBand from "@/components/NewsletterBand";

const NewsLetter: FC<NewsLetterInterface> = ({ title, emailPrompt, ctaLabel }) => (
  <NewsletterBand title={title} placeholder={emailPrompt} buttonLabel={ctaLabel} />
);

export default NewsLetter;
