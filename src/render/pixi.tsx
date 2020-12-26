import * as React from "react";
import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import { Env, PixiScene } from ".";
import { Size } from "../hook/useWindowSize";

const makeEnv = (app: PIXI.Application): Env => ({
    width: app.renderer.width,
    height: app.renderer.height,
});

type Props = {
    scene: PixiScene;
    size?: Size;
};

export const Pixi = ({ scene, size }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;

            const app = new PIXI.Application(
                (() => {
                    const config = {
                        antialias: true,
                        transparent: false,
                    };
                    if (size) {
                        return {
                            width: size.width,
                            height: size.height,
                            ...config,
                        };
                    } else {
                        return {
                            resizeTo: window,
                            ...config,
                        };
                    }
                })()
            );
            container.innerHTML = "";
            container.appendChild(app.view);

            let state = scene.setup(makeEnv(app));
            if (scene.update) {
                app.ticker.add((delta: number) =>
                    scene.update
                        ? scene.update(makeEnv(app), delta, state)
                        : null
                );
            }

            return () => {
                if (scene.destroy) {
                    scene.destroy(makeEnv(app), state);
                }
                app.destroy(true, {
                    children: true,
                    texture: true,
                    baseTexture: true,
                });
            };
        }
        return;
    }, [containerRef, scene]);

    return <div ref={containerRef} className="pixi-container" />;
};
