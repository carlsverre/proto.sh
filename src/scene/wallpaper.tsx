import { colorsRGB } from "./colors";
import { hexToRGB, RGB } from "../util/color";
import SimplexNoise from "simplex-noise";
import { Memo, initMemo, stepMemo } from "../util/memo";
import { scaleLinear } from "d3-scale";

export const name = "wallpaper";

type State = {
    noise: SimplexNoise;
    noiseMemo: Memo<ImageData>;
};

const randomColor = (): RGB =>
    colorsRGB[Math.floor(Math.random() * colorsRGB.length)];

const distributionMap = scaleLinear()
    .domain([0, 255])
    .range([0.99, 0.9999]);

const turbulence = (
    noise: SimplexNoise,
    x: number,
    y: number,
    size: number
): number => {
    let value = 0,
        initialSize = size;

    while (size >= 1) {
        value += noise.noise2D(x / size, y / size) * size;
        size /= 2.0;
    }

    return (128.0 * value) / initialSize;
};

export const init = (_: CanvasRenderingContext2D): State => ({
    noise: new SimplexNoise(Math.random),
    noiseMemo: initMemo(),
});

export const step = () => {};

export const draw = (ctx: CanvasRenderingContext2D, state: State) => {
    const [width, height] = [ctx.canvas.clientWidth, ctx.canvas.clientHeight];

    ctx.save();
    ctx.resetTransform();

    const bg = stepMemo(state.noiseMemo, [width, height], () => {
        let bg = ctx.createImageData(width, height);

        const turbPower = 0.5 + 0.5 * Math.random(); // makes twists
        const turbSize = 4096; // initial size of the turbulence

        const xBase = 3 - Math.random() * 6;
        const yBase = 3 - Math.random() * 6;
        const period = Math.random() * 3;
        const xPeriod = xBase + Math.cos(period);
        const yPeriod = yBase * Math.sin(period);

        for (var i = 0; i < bg.data.length; i += 4) {
            let x = (i / 4) % width;
            let y = Math.floor(i / 4 / width);
            let v =
                x +
                xPeriod +
                y +
                yPeriod +
                (turbPower * turbulence(state.noise, x, y, turbSize)) / 128.0;

            let sineValue = 255 * Math.abs(Math.sin(v * Math.PI));

            if (Math.random() > distributionMap(sineValue)) {
                let c = randomColor();
                let [r, g, b] = [c.r, c.g, c.b];
                const apply = (x: number) => Math.round(x);
                bg.data[i] = apply(r);
                bg.data[i + 1] = apply(g);
                bg.data[i + 2] = apply(b);
                bg.data[i + 3] = 255;
            } else {
                let l = sineValue / 255 - 0.5;
                let backgroundnoise =
                    (state.noise.noise2D(x, y) +
                        state.noise.noise2D(x / 2, y / 2) * 0.25 +
                        state.noise.noise2D(x / 4, y / 4)) *
                    0.4;
                backgroundnoise *= 1 - l * l * 2;
                backgroundnoise *= 1;

                let c = hexToRGB("#212D37");
                let [r, g, b] = [c.r, c.g, c.b];
                const apply = (x: number) =>
                    Math.round(backgroundnoise * 10 + x);
                bg.data[i] = apply(r);
                bg.data[i + 1] = apply(g);
                bg.data[i + 2] = apply(b);
                bg.data[i + 3] = 255;
            }
        }
        return bg;
    });
    ctx.putImageData(bg, 0, 0);

    ctx.restore();
};
