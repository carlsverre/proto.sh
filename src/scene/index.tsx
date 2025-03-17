import { Scene } from "../render";

import * as TrailsScene from "./trails";
import * as WavesScene from "./waves";

export const scenes: Scene[] = [TrailsScene, WavesScene];

export function loadScene(name: string | undefined): Scene | undefined {
    for (let scene of scenes) {
        if (scene.name === name) {
            return scene;
        }
    }
    return;
}
