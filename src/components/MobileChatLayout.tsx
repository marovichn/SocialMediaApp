"use client";

import { Transition, Dialog } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";
import { Icon, Icons } from "./Icons";
import SignOutButton from "./SignOutButton";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import Button, { buttonVariants } from "./UI/Button";
import SideBarChatList from "./SideBarChatList";
import FriendRequestSidebarOptions from "./FriendRequestsButton";
import UserOptions from "./UserOptions";

interface MobileChatLayoutProps {
  friends: User[];
  session: Session;
  sidebarOptions: SidebarOption[];
  unseenRequestCount: number;
}

 interface SidebarOption {
   id: number;
   name: string;
   href: string;
   Icon: Icon;
 }

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  friends,
  session,
  sidebarOptions,
  unseenRequestCount,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className='fixed bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 py-2 px-4'>
      <div className='w-full flex justify-between items-center'>
        <Link href='/dashboard' className='ml-2'>
          <Icons.Logo className='h-6 w-auto text-lime-600' />
        </Link>
        <Button
          onClick={() => setOpen(true)}
          className='gap-4 bg-lime-500 hover:bg-lime-600 transition'
        >
          Menu <Menu className='h-6 w-6' />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <div className='fixed inset-0' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-base font-semibold leading-6 text-gray-900'>
                            <Link href='/dashboard' className='h-16 -mt-7'>
                              <Icons.Logo className='h-8 w-auto text-lime-600' />
                            </Link>
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-nonetransition'
                              onClick={() => setOpen(false)}
                            >
                              <span className='sr-only'>Close panel</span>
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {/* Content */}
                        <div className='pl-3 pr-10 flex h-full w-full flex-col gap-y-5 overflow-y-auto'>
                          {friends.length > 0 ? (
                            <div className='text-xs font-semibold leading-6 text-gray-400 '>
                              Your chats
                            </div>
                          ) : (
                            <div className='text-xs font-semibold leading-6 text-gray-400 '>
                              Add some friends
                            </div>
                          )}
                          <nav className='flex flex-1 flex-col'>
                            <ul
                              role='list'
                              className='flex flex-1 flex-col gap-y-7'
                            >
                              <li>
                                <SideBarChatList
                                  friends={friends}
                                  sessionId={session.user.id}
                                />
                              </li>
                              <UserOptions
                                initialUnseenRequestCount={unseenRequestCount}
                                sessionId={session.user.id}
                              />

                              <li className='-mx-6 mt-auto flex items-center'>
                                <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                  <div className='relative h-8 w-8 bg-gray-50 rounded-full'>
                                    <Image
                                      sizes='1'
                                      fill
                                      referrerPolicy='no-referrer'
                                      className='rounded-full'
                                      src={session.user.image || ""}
                                      alt='Your profile picture'
                                    />
                                  </div>

                                  <span className='sr-only'>Your profile</span>
                                  <div className='flex flex-col'>
                                    <span aria-hidden='true'>
                                      {session.user.name}
                                    </span>
                                    <span
                                      className='text-xs text-zinc-400'
                                      aria-hidden='true'
                                    >
                                      {session.user.email}
                                    </span>
                                  </div>
                                </div>

                                <SignOutButton className='h-full aspect-square' />
                              </li>
                            </ul>
                          </nav>
                        </div>

                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
