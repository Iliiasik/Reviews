const SpecialistInfo = ({ experience_years, about,phone }: any) => (
    <>
        <div><span className="font-semibold">Опыт:</span> {experience_years ?? '-'} лет</div>
        <div><span className="font-semibold">О себе:</span> {about ?? '-'}</div>
        <div><span className="font-semibold">Телефон:</span> {phone ?? '-'}</div>

    </>
);

export default SpecialistInfo;
