import { FaPlus, FaMinus } from "react-icons/fa"
import type { ReactNode } from "react"

interface AspectSectionProps {
    title: string
    aspects: any[]
    icon: ReactNode
    color: string
    showEmptyMessage?: boolean
}

export const AspectSectionLarge = ({ title, aspects, icon, color, showEmptyMessage }: AspectSectionProps) => {
    const total = aspects?.reduce((acc, a) => acc + a.count, 0) ?? 0

    if (showEmptyMessage && (!aspects || aspects.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 bg-base-200/60 text-center h-full">
                <div className="flex items-center gap-4 mb-2">
                    <FaPlus className="text-4xl text-green-500 animate-pulse" />
                    <FaMinus className="text-4xl text-red-500 animate-pulse" />
                </div>
                <p className="text-gray-500 text-sm">Пользователи пока не делились впечатлениями</p>
            </div>
        )
    }

    return (
        <div className="mb-4">
            <h4 className="font-medium flex items-center gap-2 mb-2 text-sm">
                {icon}
                <span>{title} ({total})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {aspects.map(aspect => (
                    <div
                        key={aspect.id}
                        className={`rounded-lg border p-3 bg-${color}/5 border-${color}/20 flex justify-between items-center`}
                    >
                        <span className="text-sm">{aspect.description}</span>
                        <span className={`font-semibold text-${color}`}>{aspect.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
