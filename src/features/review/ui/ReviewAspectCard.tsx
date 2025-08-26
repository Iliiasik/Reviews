import {
    FiSmile,
    FiClock,
    FiAward,
    FiShield,
    FiMessageSquare,
    FiFrown,
    FiCalendar,
    FiHelpCircle,
    FiFeather,
    FiVolumeX,
    FiStar
} from 'react-icons/fi'
import type { JSX } from "react"

const aspectIcons: Record<number, JSX.Element> = {
    1: <FiSmile size={14} className="text-green-500" />,
    2: <FiClock size={14} className="text-blue-500" />,
    3: <FiAward size={14} className="text-yellow-500" />,
    4: <FiShield size={14} className="text-purple-500" />,
    5: <FiMessageSquare size={14} className="text-cyan-500" />,
    6: <FiFrown size={14} className="text-red-500" />,
    7: <FiCalendar size={14} className="text-orange-500" />,
    8: <FiHelpCircle size={14} className="text-gray-500" />,
    9: <FiFeather size={14} className="text-pink-500" />,
    10: <FiVolumeX size={14} className="text-indigo-500" />,
}

export const ReviewAspectCard = ({ aspect }: { aspect: any }) => {
    return (
        <div className="flex items-center gap-2 p-2 rounded-md bg-base-200 border border-base-300">
            <div className="flex-shrink-0">
                {aspectIcons[aspect.id] || <FiStar size={14} className="text-yellow-500" />}
            </div>
            <span className="text-xs font-medium text-base-content line-clamp-1">
                {aspect.description}
            </span>
        </div>
    )
}