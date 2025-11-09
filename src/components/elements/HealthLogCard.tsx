import { useNavigate } from "react-router-dom"
import { IoIosCalendar } from "react-icons/io"

interface HealthLogCardProps {
  image: string
  name: string
  _id: string
  dateofDiagnosis: string
  comment: string
}

const HealthLogCard: React.FC<HealthLogCardProps> = ({
  image,
  name,
  _id,
  dateofDiagnosis,
  comment,
}) => {
  const navigate = useNavigate()
  const date = new Date(dateofDiagnosis)
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  return (
    <div
      onClick={() => navigate(`/healthlog/${_id}`)}
      className="
        group relative cursor-pointer rounded-xl overflow-hidden
        border border-gray-100 bg-white shadow-sm 
        hover:shadow-md hover:border-green-200 hover:translate-y-[-2px]
        transition-all duration-300 ease-in-out
        w-full max-w-sm
      "
    >
      {/* Thumbnail */}
      <div className="h-36 w-full overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>

        {/* Diagnosis Date */}
        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
          <IoIosCalendar className="text-green-600 opacity-80" size={16} />
          <span>{formattedDate}</span>
        </div>

        {/* Comment */}
        {comment && (
          <p className="text-xs text-gray-500 italic line-clamp-2">
            “{comment.length > 80 ? `${comment.slice(0, 80)}...` : comment}”
          </p>
        )}
      </div>

      {/* Subtle accent bar */}
      <div className="absolute left-0 bottom-0 w-full h-1 bg-green-500/60 group-hover:bg-green-600 transition-all" />
    </div>
  )
}

export default HealthLogCard
