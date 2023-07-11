import Image from "next/image";
import { FC } from "react";

interface SideBarChatListProps {
  friends: User[];
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends }) => {
  return (
    <ul className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1' role='list'>
      {friends.sort().map((friend) => {
        return (
          <li className='flex gap-3 align-self bg-neutral-100 rounded-md p-4'>
            <Image
              className='rounded-full w-9 h-9 m-2'
              src={friend.image}
              alt='user_image'
              width={20}
              height={20}
            />
            <div className="flex flex-col">
              {friend.name}
              <div>{friend.email}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarChatList;
