const OrganizationInfo = ({ website, address, about, phone }: any) => (
    <>
        <div><span className="font-semibold">Сайт:</span> {website ?? '-'}</div>
        <div><span className="font-semibold">Адрес:</span> {address ?? '-'}</div>
        <div><span className="font-semibold">О нас:</span> {about ?? '-'}</div>
        <div><span className="font-semibold">Телефон:</span> {phone ?? '-'}</div>
    </>
);

export default OrganizationInfo;
