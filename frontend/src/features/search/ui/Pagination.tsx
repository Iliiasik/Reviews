interface Props {
    page: number;
    totalPages: number;
    onChange: (newPage: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: Props) => {
    const delta = 1;
    const range: (number | string)[] = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
        range.push(i);
    }

    if (page - delta > 2) range.unshift('...');
    if (page + delta < totalPages - 1) range.push('...');

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return (
        <div className="join">
            <button className="join-item btn" onClick={() => onChange(Math.max(page - 1, 1))} disabled={page === 1}>
                «
            </button>
            {range.map((p, i) =>
                p === '...' ? (
                    <button key={i} className="join-item btn btn-disabled">...</button>
                ) : (
                    <button key={i} className={`join-item btn ${p === page ? 'btn-active' : ''}`} onClick={() => onChange(Number(p))}>
                        {p}
                    </button>
                )
            )}
            <button className="join-item btn" onClick={() => onChange(Math.min(page + 1, totalPages))} disabled={page === totalPages}>
                »
            </button>
        </div>
    );
};
