export const useWarnToast = () => {
    return (message: string) => {
        const toast = document.createElement("div");
        toast.className = "toast toast-center z-50 bottom-14";
        toast.innerHTML = `
            <div role="alert" class="alert alert-error alert-soft shadow-lg">
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
};
