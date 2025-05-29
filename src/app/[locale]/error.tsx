"use client";
import "../globals.css";
import { useEffect } from "react";

import { Button, LinkButton } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";

import { getIssuesLink } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col gap-8 py-28 max-w-3xl m-[0_auto]" dir="ltr">
      <h2 className="text-3xl text-center">ATSNEE Website Crashed!</h2>
      <div className="w-full flex gap-4">
        <Button variant="outline" className="flex-1" onClick={() => reset()}>
          Restart
        </Button>
        <LinkButton className="flex-1" href={getIssuesLink()}>
          Open Issue
        </LinkButton>
      </div>
      <span className="text-primary/70">
        If the restart button is not working, try back to the main page and try
        again. if the problem is still please contact with us or open issue in
        our github repoistery, you will get a reward about the bug you found
      </span>
      <div className="w-full border-border border font-mono rounded-xl py-4 px-6">
        {error.message}
        <Separator />
        {error.stack}
        {/* {error.cause} */}
      </div>
    </main>
  );
}
