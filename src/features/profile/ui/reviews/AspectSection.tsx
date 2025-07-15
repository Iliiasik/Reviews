import {AspectCard} from './AspectCard';
import type {JSX} from "react";

export const AspectSection = ({ title, aspects, icon, color }: { title: string; aspects: any[]; icon: JSX.Element; color: string }) => {
    if (!aspects || aspects.length === 0) return null;

    return (
        <div className="mt-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
                {icon}
                <span>{title} ({aspects.reduce((acc, a) => acc + a.count, 0)})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {aspects.map(aspect => (
                    <AspectCard key={aspect.id} aspect={aspect} color={color} />
                ))}
            </div>
        </div>
    );
};