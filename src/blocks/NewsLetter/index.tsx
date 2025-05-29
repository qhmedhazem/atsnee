import { FC, HTMLAttributes } from "react";
import { NewsLetter as NewsLetterInterface } from "@/payload-types";
import NewsLetterForm from "./NewsLetterForm";

interface Props extends NewsLetterInterface {}

const NewsLetter: FC<Props> = (newsLetter) => {
  return (
    <section id="admission" className="w-full bg-light-blue-800 text-white">
      <div className="container w-full h-full space-y-8 py-32 flex items-center flex-col">
        <div className="space-y-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
            {newsLetter.title ||
              "Get Newsletter delivered straight to your inbox."}
          </h2>
        </div>
        <NewsLetterForm newsLetter={newsLetter} />
      </div>
    </section>
  );
};

export default NewsLetter;
