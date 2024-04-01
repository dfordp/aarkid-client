import { useNavigate } from "react-router-dom"
import { FaLeaf } from 'react-icons/fa';
import { IoIosCalendar } from 'react-icons/io';

interface PlantCardProps {
  plantName: string;
  plantimage: string;
  species: string;
  plantDop: string;
  plantcomment: string;
  plantId: string;
}

const PlantCard: React.FC<PlantCardProps> = ({plantName, plantimage, species, plantDop, plantcomment, plantId}) => {

    const navigate = useNavigate()

    const date = new Date(plantDop);
    const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

  return (
    <div onClick={()=>navigate(`/plant/${plantId}`)}  className="bg-gray-300 w-72 h-40 shadow-md rounded-md">
        <div className="bg-gray-100 h-20 rounded-t">
             <img src={plantimage} className='w-full h-20 object-cover rounded-t-md'></img>
         </div>
         <div className="bg-gray-300 h-20 flex flex-col justify-between px-1 py-1">
            <div className="font-bold text-xl">
            {plantName}
            </div>
            <div className="flex flex-row justify-between font-medium text-sm">
            <div className="flex items-center gap-2">
                <FaLeaf opacity={.5}/>
                <div>{species}</div>
                </div>
                <div className="flex items-center gap-2">
                <IoIosCalendar opacity={.5}/>
                <div>{formattedDate}</div>
                </div>
            </div>
            <div className="text-xs">
                {plantcomment}
            </div>
         </div>
    </div>
  )
}

export default PlantCard;