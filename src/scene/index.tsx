import { Scene } from "../render";

import * as TrailsScene from "./trails";
import * as WavesScene from "./waves";
import * as WallpaperScene from "./wallpaper";
import * as ShapesScene from "./shapes";

export const scenes: Scene[] = [
    TrailsScene,
    WavesScene,
    WallpaperScene,
    ShapesScene,
];

export function loadScene(name: string | undefined): Scene | undefined {
    for (let scene of scenes) {
        if (scene.name === name) {
            return scene;
        }
    }
    return;
}
