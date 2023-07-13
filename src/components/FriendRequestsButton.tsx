"use client";

import { pusherClient } from "@lib/pusher";
import { toPusherKey } from "@lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface FriendRequestsButtonProps {
  initialUnseenRequestCount: number;
  sessionId: string;
}

const FriendRequestsButton: FC<FriendRequestsButtonProps> = ({
  initialUnseenRequestCount,
  sessionId,
}) => {

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = ({senderEmail}: IncomingFriendRequest) => {
      setUnseenReqCount((prev) => prev +1);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, []);

  const [unseenReqCount, setUnseenReqCount] = useState<number>(
    initialUnseenRequestCount
  );

  return (
    <Link className='flex items-center ml-1 ' href='/dashboard/requests'>
      <span className='px-3'>
        <User size={15} className='text-lime-600' />
      </span>
      <span className='truncate font-semibold'>Friend requests</span>
      {unseenReqCount > 0 ? (
        <div className='rounded-full w-5 gap-10 h-5 text-xs flex justify-center items-center p-1 ml-auto mr-2 text-white bg-lime-600'>
          {unseenReqCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestsButton;
