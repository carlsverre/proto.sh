import * as React from "react";
import { useRef, useEffect } from "react";
import { useWindowSize, Size } from "../hook/useWindowSize";
import { Env, Canvas2DScene } from ".";

const makeEnv = (ctx: CanvasRenderingContext2D): Env => ({
    width: ctx.canvas.clientWidth,
    height: ctx.canvas.clientHeight,
});

type Props = {
    scene: Canvas2DScene;
    size?: Size;
};

export const Canvas2D = ({ scene, size }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const windowSize = useWindowSize();
    const surfaceSize = size || windowSize;

    useEffect(() => {
        if (canvasRef.current && surfaceSize) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                let running = true;
                let state = scene.setup(makeEnv(ctx), ctx);
                let lastTime = +Date.now();

                const render = () => {
                    if (!running) {
                        return;
                    }

                    const currentTime = +Date.now();
                    const delta = currentTime - lastTime;
                    lastTime = currentTime;

                    if (scene.update) {
                        scene.update(makeEnv(ctx), delta, state);
                    }

                    requestAnimationFrame(render);
                };
                render();

                return () => {
                    if (scene.destroy) {
                        scene.destroy(makeEnv(ctx), state);
                    }
                    running = false;
                };
            }
        }
        return;
    }, [canvasRef, scene]);

    return (
        <canvas ref={canvasRef} className="render-surface" {...surfaceSize} />
    );
};
