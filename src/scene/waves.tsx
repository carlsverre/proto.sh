import SimplexNoise from "simplex-noise";
import { scaleLinear, scaleQuantize } from "d3-scale";
import { colorsHex } from "./colors";
import PID from "node-pid-controller";
import clamp from "../util/clamp";

const TIME_DELTA = 0.003;
const TARGET_FRAME_RATE = 60;

const noise = new SimplexNoise(Math.random);

const unitToRad = scaleLinear()
    .domain([0, 1])
    .range([-1 * Math.PI, Math.PI]);

const noiseToColor = scaleQuantize<string>()
    .domain([0, 256])
    .range(colorsHex);

const turbulence = (x: number, y: number, size: number): number => {
    let value = 0,
        initialSize = size;

    while (size >= 1) {
        value += noise.noise2D(x / size, y / size) * size;
        size /= 2.0;
    }

    return (128.0 * value) / initialSize;
};

type State = {
    time: number;
    lastFrame: number;
    frameTimes: [];
    periodXBase: number;
    periodYBase: number;
    pixelSize: number;
    pid: PID;
};

export const init = (_: CanvasRenderingContext2D): State => {
    const pid = new PID({ k_p: 0.01, k_i: 0.001, k_d: 0.001, i_max: 10 });
    pid.setTarget(TARGET_FRAME_RATE);

    return {
        time: Math.random(),
        lastFrame: +new Date(),
        frameTimes: [],
        periodXBase: 3 - Math.random() * 6,
        periodYBase: 3 - Math.random() * 6,
        pixelSize: 5,
        pid: pid,
    };
};

export const step = (_: CanvasRenderingContext2D, state: State) => {
    const now = +new Date();
    const delta = state.pid.update(1000 / (now - state.lastFrame));
    state.lastFrame = now;

    state.pixelSize = Math.round(clamp(state.pixelSize + delta, 3, 30));

    state.time += TIME_DELTA;
};

export const draw = (ctx: CanvasRenderingContext2D, state: State) => {
    ctx.save();
    ctx.resetTransform();

    const [width, height] = [ctx.canvas.clientWidth, ctx.canvas.clientHeight];

    const periodBase = 3;
    const period = unitToRad(state.time % periodBase);

    const xPeriod = state.periodXBase + Math.cos(period);
    const yPeriod = state.periodYBase * Math.sin(period);

    const turbPower = 0.6; // makes twists
    const turbSize = 64; // initial size of the turbulence

    for (let x = 0; x < width; x += state.pixelSize) {
        for (let y = 0; y < height; y += state.pixelSize) {
            let xyValue =
                (x * xPeriod) / width +
                (y * yPeriod) / height +
                (turbPower * turbulence(x, y, turbSize)) / 256.0;

            let sineValue = 256 * Math.abs(Math.sin(xyValue * Math.PI));
            let color = noiseToColor(sineValue);

            ctx.fillStyle = color;
            ctx.fillRect(x, y, state.pixelSize, state.pixelSize);
        }
    }

    ctx.restore();
};
