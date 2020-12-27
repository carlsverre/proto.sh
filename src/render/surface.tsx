import * as React from "react";
import { Scene } from ".";
import { Size } from "../hook/useWindowSize";

// engines
import { Canvas2D } from "./canvas2d";
import { Pixi } from "./pixi";

type Props = {
    scene: Scene;
    size?: Size;
};

export const Surface = ({ scene, ...props }: Props) => {
    switch (scene.engine) {
        case "canvas2d":
            return <Canvas2D scene={scene} {...props} />;
        case "pixi":
            return <Pixi scene={scene} {...props} />;
    }
};
