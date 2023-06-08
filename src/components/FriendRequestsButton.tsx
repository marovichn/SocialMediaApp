import { User } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react'

interface FriendRequestsButtonProps {
  
}

const FriendRequestsButton: FC<FriendRequestsButtonProps> = ({}) => {
  return (
    <Link className='flex items-center ml-1 ' href="/dashboard/requests">
      <span className='px-3'>
        <User size={15} className='text-lime-600' />
      </span>
      <span className='truncate font-semibold'>Friend requests</span>
    </Link>
  );
}

export default FriendRequestsButton