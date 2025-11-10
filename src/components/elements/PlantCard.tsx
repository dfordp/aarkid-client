import { useNavigate } from "react-router-dom"
import { FaLeaf } from "react-icons/fa"
import { IoIosCalendar } from "react-icons/io"
import { motion } from "framer-motion"

interface PlantCardProps {
  plantId: string
  species: string
  plantName: string
  plantimage: string
  plantDop: string
  plantcomment: string
}

const PlantCard: React.FC<PlantCardProps> = ({
  plantName,
  plantimage,
  species,
  plantDop,
  plantcomment,
  plantId,
}) => {
  const navigate = useNavigate()
  const date = new Date(plantDop)
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  return (
    <div
      onClick={() => navigate(`/plant/${plantId}`)}
      className="group relative cursor-pointer rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white hover:translate-y-[-2px]"
    >
      {/* Plant Image */}
      <div className="h-40 w-full overflow-hidden">
        {/* <img
          src={plantimage}
          alt={plantName}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        /> */}
        <motion.img
            src={plantimage}
            alt={plantName}
            className="w-full h-40 object-cover rounded-t-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
      </div>

      {/* Plant Info */}
      <div className="p-4 space-y-2">
        {/* Plant Name */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {plantName}
        </h3>

        {/* Species & Date */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <FaLeaf className="text-green-600 opacity-70" size={14} />
            <span className="font-medium">{species}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IoIosCalendar className="text-green-600 opacity-70" size={15} />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Comment */}
        {plantcomment && (
          <p className="text-xs text-gray-500 line-clamp-2 pt-1 italic">
            “{plantcomment}”
          </p>
        )}
      </div>

      {/* Accent Bar */}
      <div className="absolute left-0 bottom-0 w-full h-1 bg-green-500/60 group-hover:bg-green-600 transition-all duration-300" />
    </div>
  )
}

export default PlantCard
