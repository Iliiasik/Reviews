interface ProfileHeaderInputProps {
    type: "specialist" | "organization";
    setType: (value: "specialist" | "organization") => void;
    name: string;
    setName: (value: string) => void;
    about: string;
    setAbout: (value: string) => void;
    nameError?: string;
    aboutError?: string;
}

export const ProfileHeaderInput = ({
                                       type,
                                       setType,
                                       name,
                                       setName,
                                       about,
                                       setAbout,
                                       nameError,
                                       aboutError,
                                   }: ProfileHeaderInputProps) => {
    return (
        <div className="space-y-4">
            <select
                className="select select-bordered w-full"
                value={type}
                onChange={(e) => setType(e.target.value as "specialist" | "organization")}
            >
                <option value="specialist">Специалист</option>
                <option value="organization">Организация</option>
            </select>

            <input
                type="text"
                className={`input input-bordered w-full ${nameError ? "border-error" : ""}`}
                placeholder={type === "specialist" ? "ФИО специалиста" : "Наименование организации"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {nameError && <span className="text-error text-sm mt-1">{nameError}</span>}

            <input
                type="text"
                className={`input input-bordered w-full ${aboutError ? "border-error" : ""}`}
                placeholder={type === "specialist" ? "Расскажите о специалисте" : "Расскажите об организации"}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
            />
            {aboutError && <span className="text-error text-sm mt-1">{aboutError}</span>}
        </div>
    )
}
