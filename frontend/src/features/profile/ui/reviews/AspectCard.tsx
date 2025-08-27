export const AspectCard = ({ aspect, color }: { aspect: any; color: string }) => {
    return (
        <div className={`card bg-${color}/10 border border-${color}/20`}>
            <div className="card-body p-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm">{aspect.description}</span>
                    <span className={`font-bold text-${color}`}>{aspect.count}</span>
                </div>
            </div>
        </div>
    );
};