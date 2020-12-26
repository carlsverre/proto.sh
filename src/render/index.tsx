export interface Env {
    width: number;
    height: number;
}

import * as PIXI from "pixi.js";

interface PixiState {
    scene: PIXI.Container;
}

export interface PixiScene {
    name: string;
    engine: "pixi";

    setup(env: Env): PixiState;
    update?(env: Env, delta: number, state: PixiState): void;
    destroy?(env: Env, state: PixiState): void;
}

interface Canvas2DState {}

export interface Canvas2DScene {
    name: string;
    engine: "canvas2d";

    setup(env: Env, ctx: CanvasRenderingContext2D): Canvas2DState;
    update?(env: Env, delta: number, state: Canvas2DState): void;
    destroy?(env: Env, state: Canvas2DState): void;
}

export type SceneState = Canvas2DState | PixiState;
export type Scene = Canvas2DScene | PixiScene;
