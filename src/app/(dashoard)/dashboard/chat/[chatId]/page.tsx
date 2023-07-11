import ChatInput from "@components/ChatInput";
import Messages from "@components/Messages";
import { fetchRedis } from "@helpers/redis";
import { authOptions } from "@lib/auth";
import { db } from "@lib/db";
import { messageArrayValidator } from "@lib/validation/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = result.map((message) => JSON.parse(message) as Message);

    const reversedMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedMessages);
  } catch (err) {
    notFound();
  }
}

const page: FC<PageProps> = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && userId2 !== user.id) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialMessages= (await getChatMessages(chatId)as any);

  return (
    <div className='flex-1 flex flex-col justify-between h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='ml-3 relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                className='rounded-full'
                fill
                alt={`${chatPartner.name} profile picture`}
                src={chatPartner.image}
                referrerPolicy='no-referrer'
              />
            </div>
          </div>
          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='font-semibold mr-3 text-gray-700'>
                {chatPartner.name}
              </span>
            </div>
            <span className=" text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      
      {/* <Messages initialMessages={initialMessages} sessionId={session.user.id}/>
 */}
      <ChatInput chatPartner={chatPartner}/>
    </div>
  );
};

export default page;
