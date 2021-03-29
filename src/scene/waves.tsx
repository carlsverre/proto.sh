import SimplexNoise from "simplex-noise";
import { scaleLinear, scaleQuantize } from "d3-scale";
import { colorsHex } from "./colors";
import { Env } from "../render";
import * as R from "../util/recorder";
import { setRandom } from "../util/query";

export const name = "waves";
export const engine = "canvas2d";

const FRAME_DELTA = 0.003;

const unitToRad = scaleLinear()
    .domain([0, 1])
    .range([0, 2 * Math.PI]);

const noiseToColor = scaleQuantize<string>()
    .domain([0, 256])
    .range(colorsHex);

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

type State = {
    noise: SimplexNoise;
    ctx: CanvasRenderingContext2D;
    pos: number;
    frameTimes: [];
    periodXBase: number;
    periodYBase: number;
    pixelSize: number;
    recorder: R.Recorder;
    finalizers: (() => void)[];
};

export const setup = (_: Env, ctx: CanvasRenderingContext2D): State => {
    var state: State = {
        noise: new SimplexNoise(Math.random),
        ctx: ctx,
        pos: 0,
        frameTimes: [],
        periodXBase: 3 - Math.random() * 6,
        periodYBase: 3 - Math.random() * 6,
        pixelSize: 5,
        recorder: R.initRecorder(ctx.canvas),
        finalizers: [],
    };

    const clickListener = async () => {
        state.pos = 0;
        setRandom();

        window.requestAnimationFrame(async () => {
            await R.startRecording(state.recorder);
        });

        const checkFinished = async () => {
            if (state.pos >= 1) {
                await R.stopRecording(state.recorder);
            } else {
                window.requestAnimationFrame(checkFinished);
            }
        };
        checkFinished();
    };

    window.addEventListener("click", clickListener);
    state.finalizers.push(() => {
        window.removeEventListener("click", clickListener);
    });

    return state;
};

export const destroy = (_: Env, state: State) => {
    for (let fin of state.finalizers) {
        fin();
    }
};

export const update = (env: Env, _: number, state: State) => {
    const { width, height } = env;
    const { ctx } = state;

    state.pixelSize = 10;

    state.pos += FRAME_DELTA;

    ctx.save();
    ctx.resetTransform();

    const periodBase = 1;
    const period = unitToRad(state.pos % periodBase);

    const xPeriod = state.periodXBase + Math.cos(period);
    const yPeriod = state.periodYBase * Math.sin(period);

    const turbPower = 0.6; // makes twists
    const turbSize = 64; // initial size of the turbulence

    for (let x = 0; x < width; x += state.pixelSize) {
        for (let y = 0; y < height; y += state.pixelSize) {
            let xyValue =
                (x * xPeriod) / width +
                (y * yPeriod) / height +
                (turbPower * turbulence(state.noise, x, y, turbSize)) / 256.0;

            let sineValue = 256 * Math.abs(Math.sin(xyValue * Math.PI));
            let color = noiseToColor(sineValue);

            ctx.fillStyle = color;
            ctx.fillRect(x, y, state.pixelSize, state.pixelSize);
        }
    }

    ctx.restore();
};
