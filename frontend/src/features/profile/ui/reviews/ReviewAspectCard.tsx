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
    1: <FiSmile size={16} className="text-green-500" />,
    2: <FiClock size={16} className="text-blue-500" />,
    3: <FiAward size={16} className="text-yellow-500" />,
    4: <FiShield size={16} className="text-purple-500" />,
    5: <FiMessageSquare size={16} className="text-cyan-500" />,
    6: <FiFrown size={16} className="text-red-500" />,
    7: <FiCalendar size={16} className="text-orange-500" />,
    8: <FiHelpCircle size={16} className="text-gray-500" />,
    9: <FiFeather size={16} className="text-pink-500" />,
    10: <FiVolumeX size={16} className="text-indigo-500" />,
}

export const ReviewAspectCard = ({ aspect }: { aspect: any }) => {
    return (
        <div className="flex-shrink-0 w-16 p-0.5 rounded-md shadow-sm flex flex-col items-center text-[10px] text-base-content/70 bg-base-200">
            <span className="text-base">
                {aspectIcons[aspect.id] || <FiStar size={16} className="text-yellow-500" />}
            </span>
            <span className="text-[8px] mt-0.5 text-center leading-tight line-clamp-2">
                {aspect.description}
            </span>
        </div>
    );
};
