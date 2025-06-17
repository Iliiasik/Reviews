export const GoogleButton = () => (
    <button
        type="button"
        onClick={() => (window.location.href = '/api/auth/google')}
        className="btn btn-outline w-full flex items-center justify-center gap-2"
    >
        <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
        />
        <span className="text-base-content">Войти через Google</span>
    </button>
);