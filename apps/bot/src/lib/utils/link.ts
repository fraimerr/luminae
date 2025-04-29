import { URL } from "node:url";

import { s } from "@sapphire/shapeshift";

const linkConstrains = s.string.url();

export const validateLink = (link: string | null | undefined, full = true): link is string => {
  if (!link) return false;
  return full ? linkConstrains.is(link) : /(https?:\/\/\S+)/g.test(link);
};

export const parseDomain = (url: string) => {
  try {
    const parsedURL = new URL(url);
    if (!["http:", "https:"].includes(parsedURL.protocol)) return null;
    return `${parsedURL.protocol}//${parsedURL.hostname}`;
    // === url.replace(/\/$/, '') ? parsedURL.hostname : null
  } catch {
    return null;
  }
};
