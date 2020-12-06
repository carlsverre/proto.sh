import { colorsHex, colorsRGB } from "./colors";
import { RGB, rgbToString } from "../util/color";

const TRAIL_LENGTH = 1000;

type State = {
    xs: number[];
    ys: number[];
    colors: RGB[];
    x: number;
    y: number;
    d: number;
};

const randomColor = (): RGB =>
    colorsRGB[Math.floor(Math.random() * colorsRGB.length)];

export const init = (ctx: CanvasRenderingContext2D): State => ({
    xs: [],
    ys: [],
    colors: [],
    x: ctx.canvas.clientWidth / 2,
    y: ctx.canvas.clientHeight / 2,
    d: 0,
});

export const step = (ctx: CanvasRenderingContext2D, state: State) => {
    if (Math.random() >= 0.95) {
        state.d = (state.d + (Math.random() > 0.5 ? 1 : -1)) % 360;
    }

    state.x += Math.cos(state.d) * 5;
    state.x = (state.x + ctx.canvas.clientWidth) % ctx.canvas.clientWidth;
    state.y += Math.sin(state.d) * 5;
    state.y = (state.y + ctx.canvas.clientHeight) % ctx.canvas.clientHeight;

    state.xs.unshift(state.x);
    state.ys.unshift(state.y);
    state.colors.unshift(randomColor());

    if (state.xs.length > TRAIL_LENGTH) {
        let cut = state.xs.length - TRAIL_LENGTH;
        state.xs = state.xs.slice(cut);
        state.ys = state.ys.slice(cut);
        state.colors = state.colors.slice(cut);
    }
};

export const draw = (ctx: CanvasRenderingContext2D, state: State) => {
    ctx.save();
    ctx.resetTransform();

    ctx.fillStyle = colorsHex[colorsHex.length - 1];
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    let alpha = 1;
    let s = 8;
    for (let i = 0; i < state.xs.length; i++) {
        ctx.fillStyle = rgbToString(state.colors[i], alpha);
        ctx.fillRect(state.xs[i], state.ys[i], s, s);

        alpha -= 1 / TRAIL_LENGTH;
        s -= 4 / TRAIL_LENGTH;
    }

    ctx.restore();
};
