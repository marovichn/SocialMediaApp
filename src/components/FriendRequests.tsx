"use client";

import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

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
  const acceptHandler =async (senderId: string)=>{
    await axios.post("/api/requests/accept", {id: senderId})

    setFriendRequests((prev)=>prev.filter((req)=> req.senderId !== senderId));

    router.refresh();
  };
  const denyHandler = async (senderId: string)=>{
    await axios.post("/api/requests/deny", { id: senderId });

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
              className='flex gap-4 items-center justify-between bg-zinc-100 rounded-md p-7 hover:bg-white transition hover:border-lime-500 hover:border border border-opacity-0 my-2'
            >
              {" "}
              <div className='flex gap-4'>
                <UserPlus className='text-black' />
                <p className='font-medium text-lg'>{request.senderEmail}</p>
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
