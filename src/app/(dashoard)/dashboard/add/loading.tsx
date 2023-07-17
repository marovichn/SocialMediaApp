
import { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css"


const loading: FC=({}) => {
  return (
    <div className='w-fill flex flex-col gap-3 p-15 '>
      <Skeleton className='mt-10 ml-10 mb-5' height={60} width={500} />
      <Skeleton className='ml-10' height={20} width={150} />
      <Skeleton className='ml-10'  height={50} width={400} />
    </div>
  );
}

export default loading