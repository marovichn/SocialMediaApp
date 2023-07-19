import { Redis } from "@upstash/redis";

export const db = new Redis({
  url: "https://inspired-dingo-37040.upstash.io",
  token:
    "AZCwASQgZTA0MWU2MDAtYjUyMS00ODNiLWFhZWMtOWZhNzUwOTMzYTRmMzI0MWE0ODA2OTM4NDJhN2EwZTM4ZDlkYzgzNTNkYTg=",
});
