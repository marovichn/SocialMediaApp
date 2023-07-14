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
    <div className='ring-1 rinf-opacity-5 ring-black'><a
      href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
      className={cn('flex gap-3 mx-5 justify-center items-center bg-white rounded-md p-5 shadow-lg transition ', {"animate-enter": t.visible, "animate-leave": !t.visible})}
    >
      <Image
      onClick={()=>toast.dismiss(t.id)}
        className='rounded-full mx-3'
        src={senderImg}
        alt={`${senderName}'s image`}
        width={30}
        height={30}
      />

      <div className='font-bold'>[{senderName}]:</div>
      <p>{text.slice(0, 5)}...</p>
    </a></div>
    
  );
};

export default UnseenChatToast