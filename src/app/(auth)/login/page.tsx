"use client";

import Button from "@components/UI/Button";
import { FC, useState } from "react";
import {AiOutlineGoogle} from "react-icons/ai";
import {signIn} from "next-auth/react"
import { toast }from "react-hot-toast";
import { Icons } from "@components/Icons";


const Page: FC = () => {
const [isLoading, setIsLoading] = useState<boolean>(false);
//LOG in WITH GOOGLE

async function loginWithGoogle(){
    setIsLoading(true);
    try{
        await signIn("google");
    }catch(err){
        toast.error("Something went wrong")
    }finally{
        setIsLoading(false);
    }
}


  return (
    <>
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex-col flex items-center max-w-md space-y-8'>
          <div className='flex flex-col items-center gap-8'>
            <Icons.Logo className="rotate-90 w-20 text-lime-500"/>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              Sign in to your account
            </h2>
          </div>
          <Button
            isLoading={isLoading}
            type='button'
            className='max-w-sm mx-auto w-full'
            onClick={loginWithGoogle}
          >
            {isLoading ? null : (
              <AiOutlineGoogle size={20} className="mr-1"></AiOutlineGoogle>
            )}
            Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
