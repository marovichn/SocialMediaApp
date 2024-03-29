import { chatHrefConstructor, cn } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react'
import { Toast, toast } from 'react-hot-toast';

interface UnseenChatToastProps {
  sessionId: string;
  senderId: string;
  senderName: string;
  senderImg: string;
  text: string;
  t: Toast
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({
  sessionId,
  senderId,
  senderName,
  senderImg,
  text,
  t
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
        { "animate-enter": t.visible, "animate-leave": !t.visible }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className='flex-1 w-0 p-4'
      >
        <div className='flex items-start'>
          <div className='flex-shrink-0 pt-0.5'>
            <div className='relative h-10 w-10'>
              <Image
                fill
                referrerPolicy='no-referrer'
                className='rounded-full'
                src={senderImg}
                alt={`${senderName} profile picture`}
              />
            </div>
          </div>

          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>{senderName}</p>
            <p className='mt-1 text-sm text-gray-500'>{text.slice(0,10)} ...</p>
          </div>
        </div>
      </a>

      <div className='flex border-l border-gray-200'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-lime-600 hover:text-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnseenChatToast