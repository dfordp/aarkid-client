import { IoLeafOutline ,IoPersonOutline , IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineMedicalServices } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { BsListTask } from "react-icons/bs";

import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { Authenticated } from '@/atom';
import toast from 'react-hot-toast';

const Sidebar = () => {

  const navigate = useNavigate();
  const setAuthenticated = useSetRecoilState(Authenticated);
  
  const menuItems = [
    { name: 'Plants', icon: IoLeafOutline   , path: '/plants' },
    { name: 'Checkups', icon: MdOutlineMedicalServices , path: '/healthlogs' },
    { name: 'Tasks', icon: BsListTask , path: '/tasks' },
    { name: 'Chat', icon: FiMessageSquare , path: '/chat' },
    { name: 'Profile', icon: IoPersonOutline , path: '/profile' },
    { name:'Logout' , icon : IoLogOutOutline ,path : '/logout'}
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    setAuthenticated(false);
    navigate('/auth')
    toast.success("Logged Out SuccesFully");
  }

  return (
    <div className='shadow-lg h-screen bg-white'>
     <div className='flex flex-row justify-center pt-3  font-bold'>
        Aarchid
      </div>
      <div className="pt-6 px-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            item.name !== 'Logout' ? (
              <Link key={item.name} to={item.path} className="flex flex-col items-center my-6 text-sm font-semibold text-gray-500 hover:text-gray-700">
                <a><IconComponent className="my-1" size={26}/></a>
                <h2>{item.name}</h2>
              </Link>
            ) : (
              <div key={item.name} className="flex flex-col items-center my-6 text-sm font-semibold text-gray-500 hover:text-gray-700" onClick={handleLogout}>
                <a><IconComponent className="my-1" size={26}/></a>
                <h2>{item.name}</h2>
              </div>
            )
          );
        })}
      </div>
    </div>
  )
}

export default Sidebar;