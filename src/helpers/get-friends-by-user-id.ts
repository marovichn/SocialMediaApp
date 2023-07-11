import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  //retrieve friends for current user
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(
      async (friendId) =>
        JSON.parse(
          (await fetchRedis("get", `user:${friendId}`)) as string
        ) as User
    )
  );

  return friends;
};
