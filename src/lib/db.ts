import { Redis } from "@upstash/redis";

export const db = new Redis({
  url: "https://inspired-dingo-37040.upstash.io",
  token:
    "AZCwASQgZTA0MWU2MDAtYjUyMS00ODNiLWFhZWMtOWZhNzUwOTMzYTRmZGIzMzVmODk2OTMwNGQ2NjkzZmFmZTFkNDJlODljYjU=",
});
