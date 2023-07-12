import { fetchRedis } from "@helpers/redis";
import { authOptions } from "@lib/auth";
import { db } from "@lib/db";
import { getServerSession } from "next-auth";
import { nanoid} from "nanoid";
import { messageValidator } from "@lib/validation/message";
import { z } from "zod";

export async function POST(req: Request){
    try{
        const { text, chatId }: { text:string , chatId:string } = await req.json();

    const session = await getServerSession(authOptions);
    if(!session){
        return new Response("Unauthorized", {status:401});
    }

    const [userId1, userId2] = chatId.split("--")

    if(session.user.id !== userId1 && session.user.id !== userId2){
        return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2: userId1;

    const friendList = await fetchRedis("smembers", `user:${session.user.id}:friends`) as string[];
    if(!friendList.includes(friendId)){
        return new Response("Unauthorized", { status: 401 });
    }

    const sender = JSON.parse(await fetchRedis("get", `user:${session.user.id}`) as string)as User;

    if(text.trim() === ""){
        return new Response("Ivalid payload (text)", { status: 401 });
    }

    const timestamp = Date.now();
    const messageData: Message= {
        id: nanoid(),
        senderId: session.user.id,
        recieverId: friendId,
        text: text,
        timestamp: timestamp
    }

    const message = messageValidator.parse(messageData);

    //validated, sending message
    await db.zadd(`chat:${chatId}:messages`, {
        score: timestamp,
        member: JSON.stringify(message)
    })

    return new Response("Success", { status: 200 });
    }catch(err){
        if (err instanceof z.ZodError) {
          return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request", { status: 400 });
    }
}