import MobileChatLayout from "@components/MobileChatLayout";
import { getFriendsByUserId } from "@helpers/get-friends-by-user-id";
import { fetchRedis } from "@helpers/redis";
import { authOptions } from "@lib/auth";
import { chatHrefConstructor } from "@lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const lastMessageRaw = await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      ) as string;
      const lastMessage = JSON.parse(lastMessageRaw) as Message;

      return {
        ...friend,
        lastMessage,
      };
    })
  );
  return (
    <div className='px-4 w-full sm:px-6 lg:px-8 py-10'>
      <h1 className='font-bold text-5xl mb-20 min-[0px]:max-md:mt-8'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='my-5 relative bg-neutral-50 border border-transparent p-3 rounded-lg hover:shadow-md transition hover:border-lime-500 hover:border-1 hover:bg-neutral-100 items-center flex justify-start'
          >
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-lime-500 drop-shadow-md' />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative sm:flex'
            >
              <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-7 w-7'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className='text-lg font-semibold'>{friend.name}</h4>
                <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderId === session.user.id
                      ? "You: "
                      : ""}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default page;
