import { useEffect, useState } from "react";

export type Size = {
    width: number;
    height: number;
};

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<Size>({
        width: Math.floor(window.innerWidth - 1),
        height: Math.floor(window.innerHeight - 1),
    });

    useEffect(() => {
        const handleResize = () =>
            setWindowSize({
                width: Math.floor(window.innerWidth - 1),
                height: Math.floor(window.innerHeight - 1),
            });

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};
