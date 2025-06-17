// src/components/Register/StepSelectType.tsx
import React from 'react';

interface Props {
    onSelect: (type: 'user' | 'specialist' | 'organization') => void;
}

const StepSelectType: React.FC<Props> = ({ onSelect}) => (
    <div className="space-y-4">
        <p className="text-center mb-4">Выберите тип аккаунта:</p>
        <button className="btn w-full"  onClick={() => onSelect('user')}>
            Пользователь
        </button>
        <button className="btn w-full"  onClick={() => onSelect('specialist')}>
            Специалист
        </button>
        <button className="btn w-full"  onClick={() => onSelect('organization')}>
            Организация
        </button>
    </div>
);

export default StepSelectType;
