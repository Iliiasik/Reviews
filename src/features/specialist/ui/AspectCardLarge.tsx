import type { AspectCount } from "@features/specialist/types/SpecialistProfile"

interface Props {
    aspect: AspectCount
    color: string
}

export const AspectCardLarge = ({ aspect, color }: Props) => (
    <div className={`rounded-lg border p-3 bg-${color}/5 border-${color}/20 flex justify-between items-center`}>
        <span className="text-sm">{aspect.description}</span>
        <span className={`font-semibold text-${color}`}>{aspect.count}</span>
    </div>
)
