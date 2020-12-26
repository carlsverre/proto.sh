import * as React from "react";
import { Scene } from ".";

// engines
import { Canvas2D } from "./canvas2d";
import { Pixi } from "./pixi";

interface Props {
    scene: Scene;
}

export const Surface = ({ scene, ...props }: Props) => {
    switch (scene.engine) {
        case "canvas2d":
            return <Canvas2D scene={scene} {...props} />;
        case "pixi":
            return <Pixi scene={scene} {...props} />;
    }
};
