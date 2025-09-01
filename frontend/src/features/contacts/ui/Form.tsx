import React, { useState } from "react";
import { useContactForm } from "../models/useContactForm";
import type { ContactRequest } from "../types/ContactRequest";

export const Form = () => {
    const { isLoading, errors, canSubmit, timer, handleSubmit, formatTimer } = useContactForm();
    const [form, setForm] = useState<ContactRequest>({ Name: "", Email: "", Description: "" });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit(form);
        if (result) setForm({ Name: "", Email: "", Description: "" });
    };

    return (
        <form onSubmit={onSubmit}>
            <fieldset className="fieldset bg-base-200 rounded-box w-72 sm:w-80 lg:w-96 p-6 flex flex-col gap-3 border-none shadow-xl">
                <legend className="fieldset-legend text-base font-semibold mb-2">Заполните форму</legend>

                <span className="badge mb-1 badge-soft badge-primary">Имя</span>
                <input
                    type="text"
                    name="Name"
                    value={form.Name}
                    onChange={onChange}
                    placeholder="Ваше имя"
                    className={`input input-bordered w-full h-11 ${errors.Name ? "input-error" : ""}`}
                />
                {errors.Name && <span className="text-sm text-error">{errors.Name}</span>}

                <span className="badge mb-1 badge-soft badge-primary">Email</span>
                <input
                    type="email"
                    name="Email"
                    value={form.Email}
                    onChange={onChange}
                    placeholder="example@mail.com"
                    className={`input input-bordered w-full h-11 ${errors.Email ? "input-error" : ""}`}
                />
                {errors.Email && <span className="text-sm text-error">{errors.Email}</span>}

                <span className="badge mb-1 badge-soft badge-primary">Сообщение</span>
                <input
                    type="text"
                    name="Description"
                    value={form.Description}
                    onChange={onChange}
                    placeholder="Ваше сообщение"
                    className={`input input-bordered w-full h-20 ${errors.Description ? "input-error" : ""}`}
                />
                {errors.Description && <span className="text-sm text-error">{errors.Description}</span>}

                <button
                    type="submit"
                    disabled={isLoading || !canSubmit}
                    className="btn btn-primary rounded-xl shadow-md w-full mt-3"
                >
                    {isLoading ? "Отправка..." : canSubmit ? "Отправить" : `Подождите ${formatTimer(timer)}`}
                </button>
            </fieldset>
        </form>
    );
};
