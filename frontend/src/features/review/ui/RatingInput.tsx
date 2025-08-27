import { motion } from "framer-motion";
import { Laugh, Frown, Angry, Meh, Smile } from "lucide-react";
import type {JSX} from "react";


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

const ratingIcons: Record<number, JSX.Element> = {
    1: <Angry size={48} color="#f44336" />,
    2: <Frown size={48} color="#ff9800" />,
    3: <Meh size={48} color="#9e9e9e" />,
    4: <Smile size={48} color="#2196f3" />,
    5: <Laugh size={48} color="#4caf50" />,
};


export const RatingInput = ({ value, onChange }: RatingInputProps) => (
    <div className="form-control items-center w-full">

        {value > 0 && (
            <motion.div
                key={value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-3 flex justify-center w-full text-5xl sm:text-6xl"
            >
                {ratingIcons[value]}
            </motion.div>
        )}

        <div className="mb-2 flex justify-center w-full">
            <div className="rating">
                {[1, 2, 3, 4, 5].map((r) => (
                    <input
                        key={r}
                        type="radio"
                        name="rating"
                        className="mask mask-star-2 bg-yellow-400 w-8 h-8 sm:w-10 sm:h-10"
                        value={r}
                        checked={value === r}
                        onChange={() => onChange(r)}
                    />
                ))}
            </div>
        </div>

        {value > 0 && (
            <div className="text-base sm:text-lg font-bold text-primary text-center tracking-wide">
                {ratingLabels[value]}
            </div>
        )}
    </div>

);
