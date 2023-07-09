"use client";

import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";

interface FrendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FrendRequests: FC<FrendRequestsProps> = ({incomingFriendRequests, sessionId}) => {
const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
  incomingFriendRequests
);

  return <>
  {friendRequests.length === 0 ? (
    <p className="text-sm text-zinc-500">Nothing to show here...</p>
  ) : (friendRequests.map((request)=>{
    <div key={request.senderId} className='flex gap-4 items-center'>
      <UserPlus className='text-black' />
      <p className='font-medium text-lg'>{request.senderEmail}</p>
      <button
        aria-label='accept friend'
        className='w-8 h-8 bg-lime-400 hover:bg-lime-600 grid place-items-center rounded-full transition hover:shadow-md'
      >
        <Check className='font-semibold text-white w-3/4 h-3/4'></Check>
      </button>
      <button
        aria-label='deny friend'
        className='w-8 h-8 bg-red-500 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
      >
        <X className='font-semibold text-white w-3/4 h-3/4'></X>
      </button>
    </div>;
  }))}
  </>;
};

export default FrendRequests;
