import React from 'react';

interface Props {
    onSelect: (type: 'user' | 'specialist' | 'organization') => void;
}

export const RegisterTypeSelect: React.FC<Props> = ({ onSelect }) => (
    <div className="space-y-4">
        <button className="btn w-full" onClick={() => onSelect('user')}>
            Пользователь
        </button>
        <button className="btn w-full" onClick={() => onSelect('specialist')}>
            Специалист
        </button>
        <button className="btn w-full" onClick={() => onSelect('organization')}>
            Организация
        </button>
    </div>
);