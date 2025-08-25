import type { AspectCount } from "@features/specialist/types/SpecialistProfile"
import { AspectCardLarge } from "./AspectCardLarge"
import { FaRegCommentDots } from "react-icons/fa"
import type { ReactNode } from "react"

interface Props {
    title: string
    aspects: AspectCount[]
    icon: ReactNode
    color: string
    showEmptyMessage?: boolean
}

export const AspectSectionLarge = ({ title, aspects, icon, color, showEmptyMessage }: Props) => {
    const total = aspects?.reduce((acc, a) => acc + a.count, 0) ?? 0

    if (showEmptyMessage && (!aspects || aspects.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 bg-base-200/60 text-center">
                <FaRegCommentDots className="text-4xl text-primary mb-2 animate-pulse" />
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
                    <AspectCardLarge key={aspect.id} aspect={aspect} color={color} />
                ))}
            </div>
        </div>
    )
}