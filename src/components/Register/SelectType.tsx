// src/components/Register/StepSelectType.tsx
import React from 'react';

interface Props {
    onSelect: (type: 'user' | 'specialist' | 'organization') => void;
    onHover: (type: 'user' | 'specialist' | 'organization') => void;
}

const StepSelectType: React.FC<Props> = ({ onSelect, onHover }) => (
    <div className="space-y-4">
        <p className="text-center mb-4">Выберите тип аккаунта:</p>
        <button className="btn w-full" onMouseEnter={() => onHover('user')} onClick={() => onSelect('user')}>
            Пользователь
        </button>
        <button className="btn w-full" onMouseEnter={() => onHover('specialist')} onClick={() => onSelect('specialist')}>
            Специалист
        </button>
        <button className="btn w-full" onMouseEnter={() => onHover('organization')} onClick={() => onSelect('organization')}>
            Организация
        </button>
    </div>
);

export default StepSelectType;
