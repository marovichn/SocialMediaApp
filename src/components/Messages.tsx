"use client"

import { cn } from '@lib/utils'
import { FC, useRef, useState } from 'react'

interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
}

const Messages: FC<MessagesProps> = ({initialMessages, sessionId}) => {
const scrollDownRef = useRef<HTMLDivElement | null>(null);
const [messages, setMessages] = useState(initialMessages);

  return <div id='messages' className='flex h-full flex-1 flex-col-reverse overflow-y-auto scrollbar-thumb-lime scrollbar-thumb-rounded scrollbar-track-lime-lighter scrollbar-w-2 scrolling-touch'>
    <div ref={scrollDownRef}/>

    {messages.map((msg, index)=>{
      const isCurrentUser = msg.senderId === sessionId;
      const hasNextMessageFromSameUser = messages[index-1]?.senderId === messages[index].senderId

      return <div key={`${msg.id}-${msg.timestamp}`}>
        <div className={cn("flex items-end", {
          "justify-end": isCurrentUser,
        })}>
          <div className={cn("flex flex-col space-y-2 text-base max-w-xs",{
            "order-1 items-end": isCurrentUser,
            "order-2 items-start": !isCurrentUser,
          })}>
            <span className={cn("px-4 py-2 rounded-lg inline-block",{
              "bg-lime-600 text-white": isCurrentUser,
              "bg-gray-200 text-gray-900": !isCurrentUser,
              "rounded-br-none": !hasNextMessageFromSameUser && isCurrentUser,
              "rounded-bl-none": !hasNextMessageFromSameUser && !isCurrentUser
            })}>
              {msg.text}{" "}
              <span className='ml-2 text-xs text-gray-400'>{msg.timestamp}</span>
            </span>
          </div>
        </div>
      </div>
    })}
  </div>
}

export default Messages