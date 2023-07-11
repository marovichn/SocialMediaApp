import { FC } from "react";

interface SideBarChatListProps {
  friends: User[];
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends }) => {
  return (
    <ul className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1' role='list'>
      {friends.sort().map((friend) => {
        return <li>{friend.name}</li>;
      })}
    </ul>
  );
};

export default SideBarChatList;
