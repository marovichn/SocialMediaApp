"use client";

import { pusherClient } from "@lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

interface SideBarChatListProps {
  friends: User[];
  sessionId: string;
}
interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [friendsState, setFriendsState] = useState(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const chatHandler = ({
      senderImg,
      senderName,
      senderId,
      recieverId,
      text,
      timestamp,
      id,
    }: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`;

      if (!shouldNotify) return;
      setUnseenMessages((prev) => [
        { senderImg, senderName, senderId, recieverId, text, timestamp, id },
        ...prev,
      ]);

      toast.custom(
        (t) => {
          return (
            <UnseenChatToast
              sessionId={sessionId}
              senderId={senderId}
              senderName={senderName}
              senderImg={senderImg}
              text={text}
              t={t}
            />
          );
        },
        {
          duration: 3000,
        }
      );
    };
    pusherClient.bind("new_message", chatHandler);
    const newFriendHandler = (both: User[]) => {
      both.forEach((user) => {
        if (sessionId !== user.id) {
          setFriendsState((prev) => [...prev, user]);
        }
      });
    };
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, router, sessionId]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev?.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname, router, sessionId]);

  return (
    <ul className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1' role='list'>
      {friendsState.sort().map((friend) => {
        const selectedClasses = pathname?.includes(friend.id)
          ? "flex gap-1 items-center justify-between bg-white border-lime-500 border rounded-md p-4 text-gray-700 group leading-6 transition"
          : "flex gap-1 items-center justify-between bg-white hover:border-lime-500 hover:border border-transparent border rounded-md p-4 text-gray-700 group leading-6 transition";
        const unseenMessagesCount: any = unseenMessages?.filter(
          (msg) => msg.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a
              className={selectedClasses}
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
                  <span className='font-bold text-lg'>{friend.name}</span>
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
