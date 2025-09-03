interface RatingInputProps {
    value: number;
    onChange: (value: number) => void;
}

const ratingLabels: Record<number, string> = {
    1: 'Ужасно',
    2: 'Плохо',
    3: 'Неплохо',
    4: 'Хорошо',
    5: 'Отлично',
};

export const RatingInput = ({ value, onChange }: RatingInputProps) => (
    <div className="flex flex-col items-center w-full gap-2 sm:gap-3">
        {value > 0 && (
            <div className="text-base sm:text-lg font-semibold">
                {ratingLabels[value]}
            </div>
        )}

        <div className="rating w-full flex justify-center gap-2 sm:gap-4 py-2">
            {[1, 2, 3, 4, 5].map((r) => (
                <input
                    key={r}
                    type="radio"
                    name="rating"
                    className="
                        mask mask-star
                        bg-yellow-500
                        w-14 h-14 sm:w-16 sm:h-16
                        md:w-20 md:h-20
                        cursor-pointer
                        transition-transform duration-150 hover:scale-110
                    "
                    value={r}
                    checked={value === r}
                    onChange={() => onChange(r)}
                />
            ))}
        </div>
    </div>
);
