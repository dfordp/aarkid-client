import { User ,UserI } from "@/atom";
import {  useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const TopBar = () => {
  const [pic,setPic] = useState("");
  const user = useRecoilValue<UserI | null>(User);

  useEffect(()=>{
    if (user) {
      setPic(user.image);
    }
  },[user])

  return (
    <div className="bg-white  lg:w-[1420px] h-16 shadow-sm px-4">
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