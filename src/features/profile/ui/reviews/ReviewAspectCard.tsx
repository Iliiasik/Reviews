import type {JSX} from "react";

const aspectIcons: Record<number, JSX.Element> = {
    1: <span className="text-lg">😊</span>,
    2: <span className="text-lg">⏰</span>,
    3: <span className="text-lg">🎓</span>,
    4: <span className="text-lg">🧼</span>,
    5: <span className="text-lg">🗣️</span>,
    6: <span className="text-lg">😠</span>,
    7: <span className="text-lg">⌛</span>,
    8: <span className="text-lg">🤷</span>,
    9: <span className="text-lg">🧹</span>,
    10: <span className="text-lg">🙉</span>,
};

export const ReviewAspectCard = ({ aspect }: { aspect: any }) => {
    return (
        <div className="flex-shrink-0 w-16 p-0.5 rounded-md shadow-sm flex flex-col items-center text-[10px] text-base-content/70 bg-base-200">
            <span className="text-base">
                {aspectIcons[aspect.id] || '⭐'}
            </span>
            <span className="text-[8px] mt-0.5 text-center leading-tight line-clamp-2">
                {aspect.description}
            </span>
        </div>
    );
};