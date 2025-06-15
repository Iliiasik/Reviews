const UserInfo = ({ name, username, email, phone }: any) => (
    <>
        <div><span className="font-semibold">ФИО:</span> {name}</div>
        <div><span className="font-semibold">Логин:</span> {username}</div>
        <div><span className="font-semibold">Email:</span> {email}</div>
        <div><span className="font-semibold">Телефон:</span> {phone ?? '-'}</div>
    </>
);


export default UserInfo;
