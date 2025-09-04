import type { ReviewAspect } from "@features/review/types/ReviewAspect.ts";
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
    FiStar,
} from 'react-icons/fi';
import type { JSX } from "react";

interface AspectCheckboxListProps {
    label: string;
    aspects: ReviewAspect[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}

const aspectIcons: Record<number, JSX.Element> = {
    1: <FiSmile size={24} className="text-green-500" />,
    2: <FiClock size={24} className="text-blue-500" />,
    3: <FiAward size={24} className="text-yellow-500" />,
    4: <FiShield size={24} className="text-purple-500" />,
    5: <FiMessageSquare size={24} className="text-cyan-500" />,
    6: <FiFrown size={24} className="text-red-500" />,
    7: <FiCalendar size={24} className="text-orange-500" />,
    8: <FiHelpCircle size={24} className="text-gray-500" />,
    9: <FiFeather size={24} className="text-pink-500" />,
    10: <FiVolumeX size={24} className="text-indigo-500" />,
};

export const AspectCheckboxList = ({
                                       label,
                                       aspects,
                                       selectedIds,
                                       onToggle,
                                   }: AspectCheckboxListProps) => {
    return (
        <div className="w-full">
            <div className="mb-2">
                <div className="text-lg text-center font-medium">{label}</div>
            </div>
            <div className="overflow-x-auto w-full scrollbar-hidden">
                <div className="inline-flex gap-3 px-4 py-2 min-w-max">
                    {aspects.map((a) => {
                        const selected = selectedIds.includes(a.id);
                        const icon = aspectIcons[a.id] || <FiStar size={24} className="text-yellow-500" />;
                        return (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => onToggle(a.id)}
                                className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-200
                                    ${selected
                                    ? 'border-blue-300 bg-base-200 shadow-md'
                                    : 'bg-base-100 border-base-300 text-base-content hover:bg-base-200 hover:border-base-400 dark:bg-base-200 dark:border-base-500 dark:hover:bg-base-300'
                                }`}
                            >
                                <div className="mb-1">{icon}</div>
                                <span className="text-xs font-medium text-center leading-tight px-1">
                                    {a.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
