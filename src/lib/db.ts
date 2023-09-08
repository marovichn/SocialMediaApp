import { Redis } from "@upstash/redis";

export const db = new Redis({
  url: "<url>",
  token:
    "<token>",
});
