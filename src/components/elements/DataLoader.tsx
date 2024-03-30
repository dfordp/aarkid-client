import { Authenticated, User } from "@/atom";
import axios from "axios"
import { useEffect, useRef } from "react"
import { useSetRecoilState } from "recoil"

const DataLoader = () => {
  const dataLoaded = useRef(false);
  const setUserData = useSetRecoilState(User);
  const setAuthenticated = useSetRecoilState(Authenticated)


  const loadUserData = async() => {
    const _id = localStorage.getItem("_id");

    if (_id) {
      try {
        const user = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getUser/${_id}` , {
          headers: {
            'Authorization': localStorage.getItem("token"),
          },
          withCredentials: true
        });
        console.log(user.data);
        setUserData(user.data)
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(()=>{  
    const token = localStorage.getItem("token");

    if(token){
      setAuthenticated(true);
      if(!dataLoaded.current){
        dataLoaded.current= true;
        loadUserData()
      }
    }  
  },[])

  return <></>
}

export default DataLoader