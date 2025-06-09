import React from 'react';

const Login: React.FC = () => {
    return (
        <main>
            <h1>Вход</h1>
            <form>
                <label>
                    Логин:
                    <input type="text" name="username" />
                </label>
                <br />
                <label>
                    Пароль:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit">Войти</button>
            </form>
        </main>
    );
};

export default Login;
