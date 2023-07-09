import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";


const page = async() => {
  const session = await getServerSession(authOptions);
  
  return (
    <div className='pt-8 w-full h-full px-10'>
      <span className='font-bold text-5xl mb-8'>Dashboard</span>
    </div>
  );
};

export default page;
