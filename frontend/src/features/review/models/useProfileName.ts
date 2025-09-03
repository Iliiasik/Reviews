import { useEffect, useState } from "react";
import { getProfileName } from "@features/review/api/getProfileName";

export const useProfileName = (type: "organization" | "specialist", id?: string) => {
    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getProfileName(type, id)
            .then((n) => setName(n))
            .catch(() =>
                setError(`Не удалось загрузить данные для ${type === "organization" ? "организации" : "специалиста"}`)
            )
            .finally(() => setLoading(false));
    }, [id, type]);

    return { name, loading, error };
};