import { Env } from "../render";
import * as PIXI from "pixi.js";

export const name = "trails";
export const engine = "pixi";

type State = {
    scene: PIXI.Container;
};

export const setup = (_env: Env): State => ({
    scene: new PIXI.Container(),
});

export const update = (_env: Env, _delta: number, _state: State) => {};
