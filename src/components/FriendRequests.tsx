"use client";

import { pusherClient } from "@lib/pusher";
import { toPusherKey } from "@lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FrendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FrendRequests: FC<FrendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  useEffect(()=>{
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));

    const friendRequestHandler=({senderId,senderEmail}:IncomingFriendRequest)=>{
      setFriendRequests((prev) => [...prev, {senderId, senderEmail}])
    }

    pusherClient.bind("incoming_friend_requests",friendRequestHandler);

    return ()=>{
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    }
  },[sessionId]);

  const acceptHandler =async (senderId: string)=>{
    await axios.post("/api/friends/accept", {id: senderId})

    setFriendRequests((prev)=>prev.filter((req)=> req.senderId !== senderId));

    router.refresh();
  };
  const denyHandler = async (senderId: string)=>{
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => {
          return (
            <div
              key={request.senderId}
              className='flex gap-4 items-center justify-between bg-zinc-100 rounded-md p-7 min-[0px]:max-md:p-6 hover:bg-white transition hover:border-lime-500 hover:border border border-opacity-0 my-2 min-[0px]:max-md:-mx-3'
            >
              {" "}
              <div className='flex gap-4'>
                <UserPlus className='text-blackmin-[0px]:max-md:w-6 min-[0px]:max-md:h-6' />
                <p className='font-medium text-lg min-[0px]:max-md:text-md'>
                  {request.senderEmail}
                </p>
              </div>
              <div className='flex gap-4'>
                <button
                  onClick={() => acceptHandler(request.senderId)}
                  aria-label='accept friend'
                  className='w-8 h-8 bg-lime-400 hover:bg-lime-600 grid place-items-center rounded-full transition hover:shadow-md'
                >
                  <Check className='font-semibold text-white w-3/4 h-3/4'></Check>
                </button>
                <button
                  onClick={() => denyHandler(request.senderId)}
                  aria-label='deny friend'
                  className='w-8 h-8 bg-red-500 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
                >
                  <X className='font-semibold text-white w-3/4 h-3/4'></X>
                </button>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default FrendRequests;
