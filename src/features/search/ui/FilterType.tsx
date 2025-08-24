import { FiUser, FiHome } from 'react-icons/fi'

interface Props {
    type: 'all' | 'specialist' | 'organization';
    onChange: (value: Props['type']) => void;
}

export const FilterType = ({ type, onChange }: Props) => (
    <form className="filter gap-2 flex flex-wrap items-center">
        <input className="btn btn-square" type="reset" value="×" onClick={() => onChange('all')} />

        <label className={`btn flex items-center gap-1 ${type === 'specialist' ? 'btn-active' : ''} text-xs sm:text-sm`}>
            <FiUser />
            <span>Специалисты</span>
            <input
                type="radio"
                name="type"
                className="hidden"
                onClick={() => onChange('specialist')}
            />
        </label>

        <label className={`btn flex items-center gap-1 ${type === 'organization' ? 'btn-active' : ''} text-xs sm:text-sm`}>
            <FiHome />
            <span>Организации</span>
            <input
                type="radio"
                name="type"
                className="hidden"
                onClick={() => onChange('organization')}
            />
        </label>
    </form>
)