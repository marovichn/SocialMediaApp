import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loading: FC = () => {
  return (
    <div className='sm:max-w-7xl px-4 w-full sm:px-6 lg:px-8 py-12'>
      <Skeleton width={250} height={100} />
      <Skeleton className='mt-10 w-full' height={70} />
      <Skeleton className='w-full mt-2' height={80} />
      <Skeleton className='w-full mt-2' height={80} />
    </div>
  );
};

export default loading;
