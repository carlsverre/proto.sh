export interface Env {
    width: number;
    height: number;
}

interface BaseScene {
    name: string;
    expensive?: boolean;
}

interface Canvas2DState {}

export interface Canvas2DScene extends BaseScene {
    engine: "canvas2d";

    setup(env: Env, ctx: CanvasRenderingContext2D): Canvas2DState;
    update?(env: Env, delta: number, state: Canvas2DState): void;
    destroy?(env: Env, state: Canvas2DState): void;
}

export type SceneState = Canvas2DState;
export type Scene = Canvas2DScene;
