import Resizer from "react-image-file-resizer";
import dayjs from "dayjs";
import { PayloadRequest, CollectionSlug } from "payload";

import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export const monthsNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIssuesLink() {
  return process.env.ISSUES_LINK as string;
}

export function captilazeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getDayStartEndDates(givenDate: Date) {
  const startOfDay = new Date(givenDate);
  const endOfDay = new Date(givenDate);

  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
  };
}

export function getCurrentDateInUserTimezone(date: Date) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDateInUserTimezone = dayjs(date).tz(userTimezone);
  return currentDateInUserTimezone.format("LL");
}

export function getRelativeTime(date: Date) {
  return dayjs(date).from(dayjs());
}

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: "/posts",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  const path = `${collectionPrefixMap[collection]}/${slug}`;

  const params = {
    slug,
    collection,
    path,
  };

  const encodedParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value);
  });

  const isProduction =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const protocol = isProduction ? "https:" : req.protocol;

  const url = `${protocol}//${req.host}/next/preview?${encodedParams.toString()}`;

  return url;
};

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = "http://localhost:3000";
  }

  return url;
};

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ""}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || "";
};
