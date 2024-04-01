import { useNavigate } from "react-router-dom"
import { IoIosCalendar } from 'react-icons/io';

// Define an interface for the props
interface HealthLogCardProps {
  image: string;
  name: string;
  _id: string;
  dateofDiagnosis: string;
  comment: string;
}

const HealthLogCard: React.FC<HealthLogCardProps> = ({image, name, _id, dateofDiagnosis, comment}) => {

    const navigate = useNavigate()
    const date = new Date(dateofDiagnosis);
    const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

  return (
    <div onClick={()=>navigate(`/healthlog/${_id}`)}  className="bg-gray-300 w-72 h-40 shadow-md rounded-md">
      <div className="bg-gray-100 h-20 rounded-t">
             <img src={image} className='w-full h-20 object-cover rounded-t-md'></img>
         </div>
         <div className="bg-gray-300 h-20 flex flex-col justify-between px-1 py-1">
            <div className="font-bold text-xl">
                {name}
            </div>
            <div className="flex flex-row justify-between font-medium text-sm">
            <div className="flex items-center gap-2">
                <IoIosCalendar opacity={.5}/>
                <div>{formattedDate}</div>
            </div>
            </div>
            <div className="text-xs">
                {comment.length > 50 ? `${comment.substring(0, 50)}...` : comment}
            </div>
         </div>
    </div>
  )
}

export default HealthLogCard;