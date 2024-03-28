// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ModeToggle } from "./mode-toggle" 
// import { useEffect, useState } from "react"
// import axios from "axios"

const TopBar = () => {

//   const [pic,setPic] = useState("");

//   useEffect(()=>{

//     const addPic = async() => {

//       const _id = localStorage.getItem("_id")
//       const userData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getUser/${_id}`,{
//         headers :{
//           'Authorization': localStorage.getItem("token"),
//         },
//         withCredentials:true,
//       });
//       setPic(userData.data.image)
//     }

//     addPic()
//   } 
//     ,[])

  return (
    <div className="bg-white w-[1418px] h-[80px] shadow-sm px-4">
     <div className="flex flex-row justify-end my-3 gap-4">
        {/* <ModeToggle/> */}
        <div>
          <img src={"https://avatars.githubusercontent.com/u/92905896?v=4"} className="w-10 h-10 rounded-full"/>
        </div>
     </div>
    </div>
  )
}

export default TopBar