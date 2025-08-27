import type { ReviewAspect } from "@features/review/types/ReviewAspect";
import {
    Smile,
    Clock,
    GraduationCap,
    Sparkles,
    Mic,
    Angry,
    Hourglass,
    ShieldAlert,
    Trash2,
    EarOff,
} from "lucide-react";
interface AspectCheckboxListProps {
    label: string;
    aspects: ReviewAspect[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}


import type {JSX} from "react";

const aspectIcons: Record<number, JSX.Element> = {
    1: <Smile size={24} />,            // 😊 — Вежливость
    2: <Clock size={24} />,            // ⏰ — Пунктуальность
    3: <GraduationCap size={24} />,    // 🎓 — Компетентность
    4: <Sparkles size={24} />,         // 🧼 — Чистота помещения
    5: <Mic size={24} />,              // 🗣️ — Умение слушать
    6: <Angry size={24} />,            // 😠 — Грубость
    7: <Hourglass size={24} />,        // ⌛ — Слишком долго ждать
    8: <ShieldAlert size={24} />,      // 🤷 — Некомпетентность
    9: <Trash2 size={24} />,           // 🧹 — Неопрятность
    10: <EarOff size={24} />,          // 🙉 — Игнорирование жалоб
};


export const AspectCheckboxList = ({
                                       label,
                                       aspects,
                                       selectedIds,
                                       onToggle,
                                   }: AspectCheckboxListProps) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 py-1">
            {aspects.map((a) => {
                    const selected = selectedIds.includes(a.id);
                    const icon = aspectIcons[a.id] ?? '⭐';

                    return (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => onToggle(a.id)}
                            className={`w-full sm:w-auto sm:min-w-[120px] px-3 py-3 border rounded-xl flex flex-col items-center justify-center transition text-center
            ${selected
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-base-100 border-base-300 text-base-content hover:bg-base-200"
                            }`}
                        >
                            <span className="text-2xl mb-1">{icon}</span>
                            <span className="text-sm text-center break-words">{a.description}</span>
                        </button>
                    );
                })}
            </div>
        </div>

    );
};
