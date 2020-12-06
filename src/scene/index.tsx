interface State {}

export interface Scene {
    init(ctx: CanvasRenderingContext2D): State;
    step(ctx: CanvasRenderingContext2D, state: State): void;
    draw(ctx: CanvasRenderingContext2D, state: State): void;
}

import * as TrailsScene from "./trails";
import * as WavesScene from "./waves";

export const scenes: Scene[] = [TrailsScene, WavesScene];
