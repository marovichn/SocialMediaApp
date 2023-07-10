import { fetchRedis } from "@helpers/redis";
import { authOptions } from "@lib/auth";
import { db } from "@lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToDeny
    );

    if (!hasFriendRequest) {
      return new Response("This request is invalid", { status: 400 });
    }

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

    return new Response("Success", { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
