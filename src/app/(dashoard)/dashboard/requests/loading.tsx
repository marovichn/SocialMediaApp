import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loading: FC = ({}) => {
  return (
    <div className='w-full flex flex-col gap-3 p-15 '>
      <Skeleton className='mt-10 ml-10 mb-8' height={60} width={500} />
      <Skeleton className='ml-10 w-full' height={50} />
      <Skeleton className='ml-10 w-full' height={50} />
      <Skeleton className='ml-10 w-full' height={50} />
    </div>
  );
};

export default loading;
