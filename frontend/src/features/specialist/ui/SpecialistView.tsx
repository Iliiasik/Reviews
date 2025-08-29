import { FiAward, FiInfo, FiThumbsUp, FiThumbsDown } from "react-icons/fi"
import { BsPatchCheckFill } from "react-icons/bs"
import { FaRegCommentDots } from "react-icons/fa"
import type { SpecialistProfile } from "@features/specialist/types/SpecialistProfile"
import { renderRatingStars, getReviewWord, getExperienceText } from "../lib/specialist"
import { AspectSectionLarge } from "@shared/ui/AspectSectionLarge.tsx"

interface Props {
    data: SpecialistProfile
}

export const SpecialistView = ({ data }: Props) => {
    const hasAspects = (data.pros_count?.length ?? 0) > 0 || (data.cons_count?.length ?? 0) > 0

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/5 flex-shrink-0">
                    <img
                        src={data.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=user"}
                        alt={data.name}
                        className="w-full h-80 lg:h-full rounded-xl object-cover shadow-lg"
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <div className="bg-base-200 rounded-xl p-6 flex-1 flex flex-col justify-between max-h-80 lg:max-h-full overflow-hidden">
                        <div className="overflow-y-auto pr-2 scrollbar-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                <h1 className="text-2xl font-bold break-words">{data.name}</h1>
                                <div className="badge badge-neutral mt-1 lg:mt-0">Специалист</div>
                            </div>

                            {data.is_confirmed && (
                                <div className="flex items-center gap-2 mb-4 text-blue-600">
                                    <BsPatchCheckFill className="w-4 h-4" />
                                    <span>Профиль подтверждён</span>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-semibold">{data.rating.toFixed(1)}</span>
                                    {renderRatingStars(data.rating)}
                                </div>
                                <span className="text-gray-500 text-sm">
                                    ({data.total_reviews ?? 0} {getReviewWord(data.total_reviews ?? 0)})
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <FiAward className="w-5 h-5 text-yellow-500"/>
                                <span>{getExperienceText(data.experience_years)}</span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiInfo className="w-5 h-5 text-gray-600"/>
                                    <span>О специалисте</span>
                                </div>
                                <p className="leading-relaxed break-words whitespace-normal">
                                    {data.about || "Нет описания"}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-base-200 rounded-xl p-6 flex-1 overflow-y-auto max-h-80 lg:max-h-full scrollbar-hidden flex flex-col justify-center">
                        {hasAspects ? (
                            <>
                                <AspectSectionLarge
                                    title="Плюсы"
                                    aspects={data.pros_count || []}
                                    icon={<FiThumbsUp className="text-green-500" />}
                                    color="green-500"
                                />
                                <AspectSectionLarge
                                    title="Минусы"
                                    aspects={data.cons_count || []}
                                    icon={<FiThumbsDown className="text-red-500" />}
                                    color="red-500"
                                />
                            </>
                        ) : (
                            <AspectSectionLarge
                                title=""
                                aspects={[]}
                                icon={<FaRegCommentDots />}
                                color="gray-400"
                                showEmptyMessage
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
