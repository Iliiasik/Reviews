import { Link } from 'react-router-dom';
import { FiStar, FiThumbsUp, FiThumbsDown, FiChevronDown } from 'react-icons/fi';
import {ReviewAspectCard} from '@features/profile/ui/reviews/ReviewAspectCard.tsx';

export const ReviewCard = ({ review }: { review: any }) => {
    const formattedDate = new Date(review.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const rating = Math.round(review.rating);

    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col min-h-[16rem] min-w-[18rem] p-2">
            <div className="card-body p-3 flex-1">
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex justify-between items-start gap-2">
                        <Link
                            to={`/${review.profile_user.role.name}/${review.profile_user.id}`}
                            className="flex items-start gap-2 min-w-0 flex-1"
                        >
                            <div className="avatar flex-shrink-0">
                                <div className="w-8 rounded-full">
                                    <img
                                        src={
                                            review.profile_user.avatar_url ||
                                            `https://api.dicebear.com/7.x/initials/svg?seed=${review.profile_user.name}`
                                        }
                                        alt="Аватар профиля"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm truncate">
                                    {review.profile_user.name}
                                </h4>
                                <div className="badge badge-ghost text-xs mt-0.5 px-1 py-0">
                                    {review.profile_user.role.name === 'specialist' && 'Специалист'}
                                    {review.profile_user.role.name === 'organization' && 'Организация'}
                                </div>
                            </div>
                        </Link>

                        <div className="flex gap-2">
                            {review.pros.length > 0 && (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-xs btn-ghost flex items-center gap-1 px-1">
                                        <FiThumbsUp size={12} className="text-success" />
                                        <span className="text-xs">{review.pros.length}</span>
                                        <FiChevronDown size={10} />
                                    </div>
                                    <div tabIndex={0} className="dropdown-content z-[1] card card-sm bg-base-100 shadow-lg w-auto max-h-60 overflow-y-auto">
                                        <div className="card-body p-2">
                                            <div className={`grid ${review.pros.length > 1 ? 'grid-cols-3' : ''} gap-1 w-max`}>
                                                {review.pros.map((pro: any) => (
                                                    <ReviewAspectCard key={pro.id} aspect={pro} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {review.cons.length > 0 && (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-xs btn-ghost flex items-center gap-1 px-1">
                                        <FiThumbsDown size={12} className="text-error" />
                                        <span className="text-xs">{review.cons.length}</span>
                                        <FiChevronDown size={10} />
                                    </div>
                                    <div tabIndex={0} className="dropdown-content z-[1] card card-sm bg-base-100 shadow-lg w-auto max-h-60 overflow-y-auto">
                                        <div className="card-body p-2">
                                            <div className={`grid ${review.cons.length > 1 ? 'grid-cols-3' : ''} gap-1 w-max`}>
                                                {review.cons.map((con: any) => (
                                                    <ReviewAspectCard key={con.id} aspect={con} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-base-content mt-1 break-words whitespace-pre-line line-clamp-3 flex-1">
                        {review.text}
                    </p>
                </div>
            </div>

            <div className="divider my-0 mx-3"></div>

            <div className="px-3 pb-2 pt-1 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                    <span className="font-medium">{rating}</span>
                    <FiStar size={12} className="fill-current" />
                </div>
                <span className="text-base-content/60">{formattedDate}</span>
            </div>
        </div>
    );
};