import Resizer from "react-image-file-resizer";
import dayjs from "dayjs";

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
import { Attachment } from "@prisma/client";

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

export function getA7medInstagram() {
  return `https://instagram.com/qhmedhazem`;
}

export function getMohamedInstagram() {
  return `https://www.instagram.com/mohaamed.wasfy/`;
}
export function getMuhammedInstagram() {
  return `https://www.instagram.com/muhammed_dahman/`;
}

export function captilazeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const resizeAvatar = (file: File): Promise<string> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri as string);
      },
      "base64"
    );
  });

export async function imageUploadHandler(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const json = (await response.json()) as Attachment;
  return "/api/cdn/" + json.id + json.extension;
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
