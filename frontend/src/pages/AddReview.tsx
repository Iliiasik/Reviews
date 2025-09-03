import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ReviewForm } from "@features/review/ui/ReviewForm";
import { useProfileName } from "@features/review/models/useProfileName";

export const AddReview = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const type = location.pathname.includes("/organization") ? "organization" : "specialist";

    const { name, loading, error } = useProfileName(type, id);

    return (
        <div className="max-w-2xl mx-auto w-full px-4 pb-6 pt-2">
            {loading ? (
                <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : error ? (
                <div className="alert alert-error shadow-sm mt-4 rounded-xl p-4 text-sm">
                    {error}
                </div>
            ) : null}

            {!loading && !error && id && name && (
                <ReviewForm
                    profileUserId={Number(id)}
                    profileName={name}
                    onSubmitSuccess={() =>
                        navigate(`/${type}/${id}`, {
                            state: {
                                toast: {
                                    message: "Отзыв успешно добавлен",
                                    type: "success",
                                },
                            },
                        })
                    }
                />
            )}
        </div>
    );
};
