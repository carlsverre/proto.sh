interface State {}

export interface Scene {
    name: string;

    init(ctx: CanvasRenderingContext2D): State;
    step(ctx: CanvasRenderingContext2D, state: State): void;
    draw(ctx: CanvasRenderingContext2D, state: State): void;
}

import * as TrailsScene from "./trails";
import * as WavesScene from "./waves";
import * as WallpaperScene from "./wallpaper";

export const scenes: Scene[] = [TrailsScene, WavesScene, WallpaperScene];

export function loadScene(name: string): Scene | undefined {
    for (let scene of scenes) {
        if (scene.name === name) {
            return scene;
        }
    }
    return;
}
