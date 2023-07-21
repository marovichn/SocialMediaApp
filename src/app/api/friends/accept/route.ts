import { fetchRedis } from "@helpers/redis";
import { authOptions } from "@lib/auth";
import { db } from "@lib/db";
import { pusherServer } from "@lib/pusher";
import { toPusherKey } from "@lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friends!", { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("This request is invalid", { status: 400 });
    }
    const acceptor = JSON.parse(
      (await fetchRedis("get", `user:${session.user.id}`)) as string
    ) as User;
    const sender = JSON.parse(
      (await fetchRedis("get", `user:${idToAdd}`)) as string
    ) as User;

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        "new_friend",
        [acceptor, sender]
      ),

      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        "new_friend",
        [acceptor, sender]
      ),

      db.sadd(`user:${session.user.id}:friends`, idToAdd),

      db.sadd(`user:${idToAdd}:friends`, session.user.id),

      db.srem(`user:${idToAdd}:incoming_friend_requests`, session.user.id),

      db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
    ]);

    return new Response("Success", { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
