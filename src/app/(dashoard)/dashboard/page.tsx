
import Button from "@components/UI/Button";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";


const page =async() => {
  const session = await getServerSession(authOptions);
  
  return (
    <div>
      Dashboard 
      {session && <Button>Sign Out</Button>}
    </div>
  );
};

export default page;
