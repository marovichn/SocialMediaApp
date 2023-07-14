"use client";

import { FC, useEffect, useState } from "react";
import { Icons, Icon } from "@components/Icons";
import Link from "next/link";
import FriendRequestsButton from "@components/FriendRequestsButton";
import { fetchRedis } from "@helpers/redis";
import { cn, toPusherKey } from "@lib/utils";
import { pusherClient } from "@lib/pusher";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MoveRight, UserPlus } from "lucide-react";
import { db } from "@lib/db";

interface UserOptionsProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}
const sidebarOptions: SidebarOption[] = [
  { id: 1, name: "Add friend", href: "/dashboard/add", Icon: "UserPlus" },
];

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const UserOptions: FC<UserOptionsProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenReq, setUnseenReq] = useState<number>(initialUnseenRequestCount);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const reqHandler = async ({ senderId }: { senderId: string }) => {
      const sender: any = await db.get(`user:${senderId}`);
      const shouldNotify = pathname !== `/dashboard/requests`;

      if (!shouldNotify) {
        setUnseenReq(0);
        return;
      }
      setUnseenReq((prev) => prev + 1);
      toast.custom((t) => {
        return (
          <div
            key={sender.id}
            className={cn(
              "flex gap-4 items-center justify-between bg-zinc-100 rounded-md p-7 hover:bg-white transition hover:border-lime-500 hover:border border border-opacity-0 my-2 mx-3",
              { "animate-enter": t.visible, "animate-leave": !t.visible }
            )}
          >
            {" "}
            <div className='flex gap-4'>
              <UserPlus className='text-black' />
              <p className='font-medium text-lg'>{sender.email}</p>
            </div>
            <div className='flex gap-4'>
              <button
                onClick={() => {
                  router.push("/dashboard/requests");
                  toast.dismiss(t.id)
                  setUnseenReq((p)=>p-1);
                }}
                aria-label='accept friend'
                className='w-8 h-8 bg-lime-400 hover:bg-lime-600 grid place-items-center rounded-full transition hover:shadow-md ml-5'
              >
                <MoveRight className='font-semibold text-white w-3/4 h-3/4 '></MoveRight>
              </button>
            </div>
          </div>
        );
      });
    };
    pusherClient.bind("incoming_friend_requests", reqHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", reqHandler);
    };
  }, [pathname]);

  return (
    <li>
      <div className='text-xs font-semibold leading-6 text-gray-400'>
        Overview
      </div>

      <ul role='list' className='-mx-2 mt-2 space-y-1'>
        {sidebarOptions.map((option) => {
          const Icon = Icons[option.Icon];
          return (
            <li
              className='hover:rounded-md hover:bg-gray-100 py-3 transition-all hover:ml-5 hover:border-lime-600 hover:border'
              key={option.id}
            >
              <Link className='flex items-center ml-1 ' href={option.href}>
                <span className='px-3'>
                  <Icon size={15} className='text-lime-600' />
                </span>
                <span className='truncate font-semibold'>{option.name}</span>
              </Link>
            </li>
          );
        })}
        <li className='hover:rounded-md hover:bg-gray-100 py-3 transition-all hover:ml-5 hover:border-lime-600 hover:border'>
          <FriendRequestsButton
            initialUnseenRequestCount={unseenReq}
            sessionId={sessionId}
          />
        </li>
      </ul>
    </li>
  );
};

export default UserOptions;
