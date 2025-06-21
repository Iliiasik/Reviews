interface Props {
    type: 'all' | 'specialist' | 'organization';
    onChange: (value: Props['type']) => void;
}

export const FilterType = ({ type, onChange }: Props) => (
    <form className="filter gap-2">
        <input className="btn btn-square" type="reset" value="×" onClick={() => onChange('all')} />
        <input className={`btn ${type === 'all' ? 'btn-active' : ''}`} type="radio" name="type" aria-label="Все" onClick={() => onChange('all')} />
        <input className={`btn ${type === 'specialist' ? 'btn-active' : ''}`} type="radio" name="type" aria-label="Специалисты" onClick={() => onChange('specialist')} />
        <input className={`btn ${type === 'organization' ? 'btn-active' : ''}`} type="radio" name="type" aria-label="Организации" onClick={() => onChange('organization')} />
    </form>
);
