import { Env } from "../render";
import * as PIXI from "pixi.js";
import { colorsNum } from "./colors";
import V from "victor";

export const name = "shapes";
export const engine = "pixi";

type State = {
    scene: PIXI.Container;
    env: Env;
    sceneHistory: PIXI.DisplayObject[];
    current?: PIXI.DisplayObject;
};

const randomColor = (): number =>
    colorsNum[Math.floor(Math.random() * colorsNum.length)];

export const setup = (env: Env): State => {
    const scene = new PIXI.Container();
    scene.sortableChildren = true;

    const state: State = { scene, env, sceneHistory: [] };

    const generators = [makeRectangle, makeCircle];

    let buttons = new PIXI.Container();
    buttons.x = 5;
    buttons.y = 5;
    buttons.zIndex = 999;
    scene.addChild(buttons);

    const renderButtons = () => {
        const buttonSize = 20;
        const buttonMargin = 5;

        buttons.removeChildren();

        if (state.sceneHistory.length <= 1) {
            return;
        }

        for (let i = 0; i < state.sceneHistory.length; i++) {
            const container = state.sceneHistory[i];

            let button = new PIXI.Graphics();
            buttons.addChild(button);

            button.x = i * (buttonSize + buttonMargin);

            button.beginFill(0xffffff);
            button.drawCircle(buttonSize / 2, buttonSize / 2, buttonSize / 2);
            button.endFill();

            if (container === state.current) {
                button.beginFill(0x0);
                button.drawCircle(buttonSize / 2, buttonSize / 2, 3);
                button.endFill();
            }

            button.addListener("click", (evt: PIXI.InteractionEvent) => {
                switchScene(container);
            });
            button.interactive = true;
        }
    };

    const switchScene = (target: PIXI.DisplayObject) => {
        let current = state.current;
        if (current) {
            scene.removeChild(current);
        }
        scene.addChild(target);
        state.current = target;
        renderButtons();
    };

    const nextScene = () => {
        if (state.current) {
            scene.removeChild(state.current);
        }

        let container = new PIXI.Container();
        scene.addChild(container);
        state.sceneHistory.push(container);
        if (state.sceneHistory.length > 100) {
            state.sceneHistory = state.sceneHistory.slice(
                state.sceneHistory.length - 10
            );
        }
        state.current = container;

        let bg = new PIXI.Graphics();
        bg.beginFill(randomColor());
        bg.drawRect(0, 0, state.env.width, state.env.height);
        bg.endFill();
        container.addChild(bg);

        const num = Math.max(2, Math.floor(Math.random() * 6));
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < generators.length; j++) {
                if (Math.random() < 0.5) {
                    container.addChild(generators[j](state.env));
                }
            }
        }

        renderButtons();
    };

    scene.addListener("click", (evt: PIXI.InteractionEvent) => {
        if (evt.target === scene) {
            nextScene();
        }
    });
    scene.interactive = true;

    nextScene();

    return state;
};

export const update = (env: Env, _delta: number, state: State) => {
    if (state.env.width !== env.width || state.env.height !== env.height) {
        state.env = env;
        state.scene.hitArea = new PIXI.Rectangle(0, 0, env.width, env.height);
    }
};

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
    let circleCenter = new V(
        Math.random() * env.width,
        Math.random() * env.height
    ).unfloat();

    const radius = Math.max(
        50,
        Math.floor((Math.random() * Math.min(env.width, env.height)) / 2)
    );

    let el = new PIXI.Graphics();
    el.beginFill(randomColor());
    el.drawCircle(circleCenter.x, circleCenter.y, radius);
    el.endFill();

    return el;
};
