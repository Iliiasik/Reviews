import type { ReviewAspect } from "@features/review/types/ReviewAspect";

interface AspectCheckboxListProps {
    label: string;
    aspects: ReviewAspect[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}

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
            <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar">
                {aspects.map((a) => {
                    const selected = selectedIds.includes(a.id);

                    return (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => onToggle(a.id)}
                            className={`min-w-[120px] shrink-0 p-3 border rounded-xl flex flex-col items-center justify-center transition
                                ${
                                selected
                                    ? "bg-blue-100 border-blue-400 text-blue-800"
                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <span className="text-2xl mb-1">⭐</span>
                            <span className="text-sm text-center">{a.description}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
