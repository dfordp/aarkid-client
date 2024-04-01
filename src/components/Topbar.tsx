import { User } from "@/atom";
import {  useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

// Define an interface for the user object
interface User {
  image: string;
  // Add other properties of the user object here
}

const TopBar = () => {

  const [pic,setPic] = useState("");
  const user = useRecoilValue(User)
  useEffect(()=>{
    setPic(user?.image)
  },[])


  return (
    <div className="bg-white w-[1418px] h-[80px] shadow-sm px-4">
     <div className="flex flex-row justify-end my-3 gap-4">
        {/* <ModeToggle/> */}
        <div>
          <img src={pic} className="w-10 h-10 rounded-full"/>
        </div>
     </div>
    </div>
  )
}

export default TopBar