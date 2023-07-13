"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface FriendRequestSidebarOptionsProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    pusherClient.bind("new_friend", addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_friend", addedFriendHandler);
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <Link className='flex items-center ml-1 ' href='/dashboard/requests'>
      <span className='px-3'>
        <User size={15} className='text-lime-600' />
      </span>
      <span className='truncate font-semibold'>Friend requests</span>
      {unseenRequestCount > 0 ? (
        <div className='rounded-full w-5 gap-10 h-5 text-xs flex justify-center items-center p-1 ml-auto mr-2 text-white bg-lime-600'>
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestSidebarOptions;
