import AddFriendButton from '@components/AddFriendButton'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className='py-10 w-full h-full px-10 mb-[65px] min-[0px]:max-md:mt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>

      <AddFriendButton></AddFriendButton>
    </main>
  );
}

export default page