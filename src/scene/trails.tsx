import { colorsRGB } from "./colors";
import { RGB, rgbToString } from "../util/color";
import SimplexNoise from "simplex-noise";
import { Memo, initMemo, stepMemo } from "../util/memo";
import { Env } from "../render";

const TRAIL_LENGTH = 1000;
const BACKGROUND = colorsRGB[colorsRGB.length - 1];

export const name = "trails";
export const engine = "canvas2d";

type State = {
    ctx: CanvasRenderingContext2D;
    xs: number[];
    ys: number[];
    colors: RGB[];
    x: number;
    y: number;
    d: number;
    noise: SimplexNoise;
    noiseMemo: Memo<ImageData>;
};

const randomColor = (): RGB =>
    colorsRGB[Math.floor(Math.random() * colorsRGB.length)];

export const setup = (env: Env, ctx: CanvasRenderingContext2D): State => ({
    ctx: ctx,
    xs: [],
    ys: [],
    colors: [],
    x: env.width / 2,
    y: env.height / 2,
    d: 0,
    noise: new SimplexNoise(Math.random),
    noiseMemo: initMemo(),
});

export const update = (env: Env, _: number, state: State) => {
    const { width, height } = env;

    if (Math.random() >= 0.95) {
        state.d = (state.d + (Math.random() > 0.5 ? 1 : -1)) % 360;
    }

    state.x += Math.cos(state.d) * 5;
    state.x = (state.x + width) % width;
    state.y += Math.sin(state.d) * 5;
    state.y = (state.y + height) % height;

    state.xs.push(state.x);
    state.ys.push(state.y);
    state.colors.push(randomColor());

    if (state.xs.length > TRAIL_LENGTH) {
        let cut = state.xs.length - TRAIL_LENGTH;
        state.xs = state.xs.slice(cut);
        state.ys = state.ys.slice(cut);
        state.colors = state.colors.slice(cut);
    }

    // draw
    const { ctx } = state;
    ctx.save();
    ctx.resetTransform();

    const bg = stepMemo(state.noiseMemo, [width, height], () => {
        let bg = ctx.createImageData(width, height);

        for (var i = 0; i < bg.data.length; i += 4) {
            let x = (i / 4) % width;
            let y = Math.floor(i / 4 / width);
            let v = state.noise.noise2D(x, y);

            const apply = (x: number) => x + 10 * v;

            bg.data[i] = apply(BACKGROUND.r);
            bg.data[i + 1] = apply(BACKGROUND.g);
            bg.data[i + 2] = apply(BACKGROUND.b);
            bg.data[i + 3] = 255;
        }
        return bg;
    });
    ctx.putImageData(bg, 0, 0);

    let alpha = (TRAIL_LENGTH - state.xs.length) / TRAIL_LENGTH;
    let s = Math.max(3, (1 - alpha) * 5);

    for (let i = 0; i < state.xs.length; i++) {
        ctx.fillStyle = rgbToString(state.colors[i], alpha);
        ctx.fillRect(state.xs[i], state.ys[i], s, s);

        alpha += 1 / TRAIL_LENGTH;
        s += 4 / TRAIL_LENGTH;
    }

    ctx.restore();
};
