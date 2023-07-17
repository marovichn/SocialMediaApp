import { fetchRedis } from "@helpers/redis";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import FriendRequests from "@components/FriendRequests";

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  //ids of users that sent request
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const requestsEmails = await Promise.all(
    incomingSenderIds.map(async (senderId)=>{
        const senderRes = await fetchRedis("get", `user:${senderId}`) as string;
        const sender = JSON.parse(senderRes) as User;
        

        return {
            senderId,
            senderEmail: sender.email,
        }
    })
  )

  return (
    <main className='pt-8 w-full h-full px-10'>
      <h1 className='font-bold text-5xl mb-[65px] mt-10'>{requestsEmails.length === 0 ? "You don't have any requests." : "Friend Requests"}</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={requestsEmails}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default page;
