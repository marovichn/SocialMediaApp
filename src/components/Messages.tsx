"use client";

import { pusherClient } from "@lib/pusher";
import { cn, toPusherKey } from "@lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatPartner: User;
  sessionImg: string | undefined | null;
  chatId: string;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messagesHandler = ({
      senderId,
      recieverId,
      text,
      timestamp,
      id,
    }: Message) => {
      setMessages((prev) => [
        { senderId, recieverId, text, timestamp, id },
        ...prev,
      ]);
    };

    pusherClient.bind("incoming-message", messagesHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-messages", messagesHandler);
    };
  }, [chatId]);

  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse overflow-y-auto scrollbar-thumb-lime scrollbar-thumb-rounded scrollbar-track-lime-lighter scrollbar-w-2 scrolling-touch'
    >
      <div ref={scrollDownRef} />

      {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        function formatTimestamp(timestamp: number) {
          return format(timestamp, "HH:mm");
        }

        return (
          <div key={`${msg.id}-${msg.timestamp}`}>
            <div
              className={cn("flex items-end mx-2 mb-1", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn("flex flex-col space-y-2 text-base max-w-xs", {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                })}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-lime-500 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {msg.text}{" "}
                  <span className='ml-2 text-xs text-gray-500'>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1 mr-2": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  sizes='1'
                  className='rounded-full mb-3 ml-1 mr-1'
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt='user image'
                ></Image>
              </div>
            </div>
          </div>
        );
      })}
      {messages.length > 0 ? (
        <p className='align-items justify-center flex mb-5 text-gray-400'>
          You reached the top. No previous messages.
        </p>
      ) : null}
    </div>
  );
};

export default Messages;
