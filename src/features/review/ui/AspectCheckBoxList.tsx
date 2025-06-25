import type { ReviewAspect } from "@features/review/types/ReviewAspect";

interface AspectCheckboxListProps {
    label: string;
    aspects: ReviewAspect[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}

const aspectIcons: Record<number, string> = {
    1: '😊',
    2: '🎓',
    3: '🧼',
    4: '🗣️',
    5: '❤️',
    6: '⏱️',
    7: '😠',
    8: '🏢',
    9: '❓',
    10: '💸',
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
            <div className="flex flex-wrap gap-2 py-1">
                {aspects.map((a) => {
                    const selected = selectedIds.includes(a.id);
                    const icon = aspectIcons[a.id] ?? '⭐';

                    return (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => onToggle(a.id)}
                            className={`w-full max-w-[140px] sm:min-w-[110px] p-3 border rounded-xl flex flex-col items-center justify-center transition text-center
                                ${
                                selected
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-base-100 border-base-300 text-base-content hover:bg-base-200"
                            }`}
                        >
                            <span className="text-2xl mb-1">{icon}</span>
                            <span className="text-sm text-center">{a.description}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
