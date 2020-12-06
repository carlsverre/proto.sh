import * as React from "react";
import { useRef, useEffect } from "react";
import { useWindowSize } from "../hook/useWindowSize";
import { Scene } from "../scene";

export const Surface = ({ scene }: { scene: Scene }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const windowSize = useWindowSize();

    useEffect(() => {
        if (canvasRef.current && windowSize) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                let running = true;
                let state = scene.init(ctx);

                const render = () => {
                    if (!running) {
                        return;
                    }

                    scene.step(ctx, state);
                    scene.draw(ctx, state);

                    requestAnimationFrame(render);
                };
                render();
                return () => {
                    running = false;
                };
            }
        }
        return;
    }, [canvasRef, scene]);

    return (
        <canvas ref={canvasRef} className="render-surface" {...windowSize} />
    );
};
