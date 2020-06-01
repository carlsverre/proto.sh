import React from "react";
import SimplexNoise from "simplex-noise";
import tinycolor from "tinycolor2";
import { scaleLinear, scaleQuantize } from "d3-scale";
import Layout from "../layouts";

const noise = new SimplexNoise(Math.random);

const colors = [
  "#1DB0FD",
  "#1AC0F2",
  "#2FD3DD",
  "#84C8B1",
  "#74D8C0",
  "#D4A989",
  "#D5B47F",
  "#ECAF6E",
  "#FD7D70",
  "#B16080",
  "#A75A7C",
  "#745388",
  "#6C5589",
  "#585987",
  "#4A5785",
];

const unitToRad = scaleLinear()
  .domain([0, 1])
  .range([-1 * Math.PI, Math.PI]);

const noiseToColor = scaleQuantize().domain([0, 256]).range(colors);

const TIME_DELTA = 0.003;
const TARGET_FRAME_TIME = 50; // ms

// these are adjusted by updatePerf() in order to render close to the
// TARGET_FRAME_TIME
let PIXEL_WIDTH = 5;
let PIXEL_HEIGHT = 5;

function turbulence(x, y, size) {
  let value = 0,
    initialSize = size;

  while (size >= 1) {
    value += noise.noise2D(x / size, y / size) * size;
    size /= 2.0;
  }

  return (128.0 * value) / initialSize;
}

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.time = Math.random();
    this.lastFrame = +new Date();
    this.frameTimes = [];

    // this bool is set to false when this component unmounts in order to
    // kill the draw loop
    this.shouldDraw = true;

    this.periodXBase = 3 - Math.random() * 6;
    this.periodYBase = 3 - Math.random() * 6;
    console.log("Period bases: ", this.periodXBase, this.periodYBase);
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize, false);
    this.onWindowResize();

    this.draw();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    this.shouldDraw = false;
  }

  onWindowResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  updatePerf = () => {
    const now = +new Date();
    const frameTime = now - this.lastFrame;
    this.lastFrame = now;

    if (frameTime < TARGET_FRAME_TIME - 5) {
      PIXEL_WIDTH = Math.max(3, PIXEL_WIDTH - 1);
      PIXEL_HEIGHT = Math.max(3, PIXEL_HEIGHT - 1);
    } else if (frameTime > TARGET_FRAME_TIME + 5) {
      PIXEL_WIDTH = Math.min(30, PIXEL_WIDTH + 1);
      PIXEL_HEIGHT = Math.min(30, PIXEL_HEIGHT + 1);
    }
  };

  draw = () => {
    // set to false when the component unmounts
    if (!this.shouldDraw) {
      return;
    }

    this.updatePerf();

    window.requestAnimationFrame(this.draw);

    this.time += TIME_DELTA;

    const { width, height } = this.state;
    const { ctx } = this;

    ctx.clearRect(0, 0, width, height);

    const periodBase = 3;
    const period = unitToRad(this.time % periodBase);

    const xPeriod = this.periodXBase + Math.cos(period);
    const yPeriod = this.periodYBase * Math.sin(period);

    const turbPower = 0.6; // makes twists
    const turbSize = 64; // initial size of the turbulence

    for (let x = 0; x < width; x += PIXEL_WIDTH) {
      for (let y = 0; y < height; y += PIXEL_HEIGHT) {
        let xyValue =
          (x * xPeriod) / width +
          (y * yPeriod) / height +
          (turbPower * turbulence(x, y, turbSize)) / 256.0;
        let sineValue = 256 * Math.abs(Math.sin(xyValue * Math.PI));
        let color = noiseToColor(sineValue);

        ctx.fillStyle = tinycolor(color).toString();
        ctx.fillRect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }
    }
  };

  render() {
    return (
      <Layout>
        <canvas
          aria-label="pretty pixels"
          width={this.state.width}
          height={this.state.height}
          style={{ display: "block" }}
          ref={(canvas) => {
            if (canvas) {
              this.ctx = canvas.getContext("2d");
            }
          }}
        />
      </Layout>
    );
  }
}
