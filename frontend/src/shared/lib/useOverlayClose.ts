import React from "react";

export function useOverlayClose(onClose: () => void) {
    return React.useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );
}
