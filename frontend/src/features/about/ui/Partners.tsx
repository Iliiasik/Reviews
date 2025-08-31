import { useEffect, useState } from "react";
import type { Partner } from "../types/Partner";
import { getPartners } from "../api/partners";

export const Partners = () => {
    const [partners, setPartners] = useState<Partner[]>([]);

    useEffect(() => {
        getPartners().then(setPartners);
    }, []);

    return (
        <section className="py-16 px-6 sm:px-10 lg:px-20 bg-base-100">
            <h2 className="text-3xl font-bold mb-12 text-center">Наши партнеры</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
                {partners.map((partner) => (
                    <a
                        key={partner.ID}
                        href={partner.Website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-105"
                    >
                        <img
                            src={partner.LogoURL || "https://via.placeholder.com/150x80?text=Logo"}
                            className="h-20 object-contain"
                        />
                    </a>
                ))}
            </div>
        </section>
    );
};
