import { forwardRef } from 'react';

interface ReviewsTabProps {
    profile: any;
}

export const ReviewsTab = forwardRef<HTMLDivElement, ReviewsTabProps>(({ profile }, ref) => {
    const userReviews = [
        { id: 1, author: 'Иван Иванов', rating: 5, text: 'Отличный сервис!', date: '2023-05-15' },
        { id: 2, author: 'Петр Петров', rating: 4, text: 'Хорошее качество услуг', date: '2023-04-22' }
    ];

    const receivedReviews = [
        { id: 1, author: 'Алексей Смирнов', rating: 5, text: 'Профессионал своего дела!', date: '2023-06-10' }
    ];

    return (
        <div ref={ref} className="divide-y divide-base-300">
            <div className="px-6 py-5">
                <h2 className="text-xl font-semibold mb-6">Отзывы</h2>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Ваши отзывы</h3>
                        {userReviews.length > 0 ? (
                            <div className="space-y-4">
                                {userReviews.map(review => (
                                    <div key={review.id} className="card bg-base-100 shadow-sm">
                                        <div className="card-body">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{review.author}</h4>
                                                    <div className="text-sm text-base-content/70">{review.date}</div>
                                                </div>
                                                <div className="badge badge-primary gap-1">
                                                    {review.rating} ★
                                                </div>
                                            </div>
                                            <p className="mt-2">{review.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info bg-base-100 border-base-300">
                                <span>Вы еще не оставляли отзывов</span>
                            </div>
                        )}
                    </div>

                    {(profile?.role === 'specialist' || profile?.role === 'organization') && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Отзывы о вас</h3>
                            {receivedReviews.length > 0 ? (
                                <div className="space-y-4">
                                    {receivedReviews.map(review => (
                                        <div key={review.id} className="card bg-base-100 shadow-sm">
                                            <div className="card-body">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{review.author}</h4>
                                                        <div className="text-sm text-base-content/70">{review.date}</div>
                                                    </div>
                                                    <div className="badge badge-primary gap-1">
                                                        {review.rating} ★
                                                    </div>
                                                </div>
                                                <p className="mt-2">{review.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info bg-base-100 border-base-300">
                                    <span>Пока нет отзывов о вас</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});