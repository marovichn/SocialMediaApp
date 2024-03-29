"use client";

import { FC, useState } from "react";
import Button from "./UI/Button";
import { addFriendValidator } from "@lib/validation/add-friends";
import axios from "axios";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccesssState, setShowSuccessState] = useState<boolean>(false);

  type FormData = z.infer<typeof addFriendValidator>

  const {
    register, handleSubmit, setError, formState:{errors}
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setShowSuccessState(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError("email", {message: err.message});
        return;
      }
      if (err instanceof AxiosError) {
        setError("email", { message: err.response?.data });
        return;
      }

      setError("email", {message: "Something went wrong"});
    }
  };

  const onSubmit = (data: FormData)=>{
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}className='max-w-sm'>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        Add friend by E-mail
      </label>

      <div className='mt-2 flex gap-4'>
        <input
        {...register("email")}
          type='text'
          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='you@example.com'
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccesssState ? <p className="mt-1 text-sm text-green-600">Friend request sent!</p> : null}
    </form>
  );
};

export default AddFriendButton;
