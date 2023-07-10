import { authOptions } from "@lib/auth";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Icons, Icon } from "@components/Icons";
import Image from "next/image";
import SignOutButton from "@components/SignOutButton";
import FriendRequestsButton from "@components/FriendRequestsButton";
import { fetchRedis } from "@helpers/redis";

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  { id: 1, name: "Add friend", href: "/dashboard/add", Icon: "UserPlus" },
];

const layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);

  const unseenReqCount = (await fetchRedis("smembers", `user:${session?.user.id}:incoming_friend_requests`) as User[]).length;

  if (!session) notFound();

  return (
    <div className='w-full flex h-screen'>
      <div className='flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
          <Icons.Logo className='h-8 w-auto text-lime-600' />
        </Link>
        <div className='text-xs font-semibold leading-6 text-gray-400 '>
          Your chats
        </div>
        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>Chat 1</li>
            <li>Chat 2</li>
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
                      <Link
                        className='flex items-center ml-1 '
                        href={option.href}
                      >
                        <span className='px-3'>
                          <Icon size={15} className='text-lime-600' />
                        </span>
                        <span className='truncate font-semibold'>
                          {option.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li className='hover:rounded-md hover:bg-gray-100 py-3 transition-all hover:ml-5 hover:border-lime-600 hover:border'>
                  <FriendRequestsButton initialUnseenRequestCount={unseenReqCount} sessionId={session.user.id} />
                </li>
              </ul>
            </li>

            <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50 rounded-full'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ""}
                    alt='Your profile picture'
                  />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className='h-full aspect-square' />
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default layout;
