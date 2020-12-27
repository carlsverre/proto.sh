import { Env } from "../render";
import * as PIXI from "pixi.js";
import { colorsNum } from "./colors";
import V from "victor";

export const name = "shapes";
export const engine = "pixi";

type State = {
    scene: PIXI.Container;
};

const randomColor = (): number =>
    colorsNum[Math.floor(Math.random() * colorsNum.length)];

export const setup = (env: Env): State => {
    const scene = new PIXI.Container();

    const num = Math.max(2, Math.floor(Math.random() * 6));
    for (let i = 0; i < num; i++) {
        Math.random() > 0.5
            ? scene.addChild(makeRectangle(env))
            : scene.addChild(makeCircle(env));
    }

    return { scene };
};

export const update = (_env: Env, _delta: number, _state: State) => {};

const makeRectangle = (env: Env): PIXI.Graphics => {
    // pick a starting x & y position somewhere around the center
    // we do this by picking a direction and distance
    const center = new V(env.width, env.height).divideScalar(2).unfloat();
    const offset = new V(1, 1)
        .multiplyScalar((Math.random() * Math.min(env.width, env.height)) / 6)
        .rotate(Math.random() * Math.PI * 2);

    const pos = center.add(offset);

    // top = 0, right = 1, bottom = 2, left = 3
    const side = Math.floor(Math.random() * 4);
    const thickness = Math.max(150, Math.floor(Math.random() * 300));

    let [w, h] = [0, 0];
    switch (side) {
        // top
        case 0:
            w = thickness;
            h = -pos.y;
            break;
        // right
        case 1:
            w = env.width - pos.x;
            h = thickness;
            break;
        // bottom
        case 2:
            w = thickness;
            h = env.height - pos.y;
            break;
        // left
        case 3:
            w = -pos.x;
            h = thickness;
            break;
    }

    let el = new PIXI.Graphics();
    el.beginFill(randomColor());
    el.drawRect(pos.x, pos.y, w, h);
    el.endFill();

    return el;
};

const makeCircle = (env: Env): PIXI.Graphics => {
    // top = 0, right = 1, bottom = 2, left = 3
    const side = Math.floor(Math.random() * 4);
    const radius = Math.max(
        Math.min(env.width, env.height) / 4,
        Math.floor((Math.random() * Math.min(env.width, env.height)) / 2)
    );

    let circleCenter = new V(env.width, env.height).divideScalar(2).unfloat();
    switch (side) {
        // top
        case 0:
            circleCenter.y = 0;
            break;
        // right
        case 1:
            circleCenter.x = env.width;
            break;
        // bottom
        case 2:
            circleCenter.y = env.height;
            break;
        // left
        case 3:
            circleCenter.x = 0;
            break;
    }

    let el = new PIXI.Graphics();
    el.beginFill(randomColor());
    el.drawCircle(circleCenter.x, circleCenter.y, radius);
    el.endFill();

    return el;
};
