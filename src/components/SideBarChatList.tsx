"use client";

import { chatHrefConstructor } from "@lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface SideBarChatListProps {
  friends: User[];
  sessionId: string;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev?.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1' role='list'>
      {friends.sort().map((friend) => {
        const unseenMessagesCount: any = unseenMessages?.filter(
          (msg) => msg.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a
              className='flex gap-1 items-center justify-between bg-white hover:border-lime-500 
              hover:border border-transparent border rounded-md p-4 text-gray-700 group leading-6 transition'
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
            >
              <div className='flex gap-3 items-center'>
                <Image
                  className='rounded-full w-9 h-9 m-2 ring ring-lime-500 shadow-md shadow-inset'
                  src={friend.image}
                  alt='user_image'
                  width={20}
                  height={20}
                />
                <div className='flex flex-col'>
                  <span className='font-bold text-md'>{friend.name}</span>
                  <div className='text-xs'>{friend.email}</div>
                </div>
              </div>
              <div>
                {unseenMessagesCount > 0 ? (
                  <div className='bg-lime-500 font-medium text-xs rounded-full text-white w-4 h-4 flex justify-center items-center p-1'>
                    {unseenMessagesCount}
                  </div>
                ) : null}
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarChatList;
