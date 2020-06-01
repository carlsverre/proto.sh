import React from "react";
import SimplexNoise from "simplex-noise";
import tinycolor from "tinycolor2";
import { scaleQuantize } from "d3-scale";

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

const noiseToColor = scaleQuantize().domain([-1, 1]).range(colors);

export default class FaviconPage extends React.Component {
  componentDidMount() {
    this.iteration = 0;
    this.draw();
  }

  draw = () => {
    const { ctx } = this;
    const size = 16;
    const pixelSize = 4;

    this.iteration += 1;

    ctx.clearRect(0, 0, size, size);

    for (let x = 0; x < size; x += pixelSize) {
      for (let y = 0; y < size; y += pixelSize) {
        let color = noiseToColor(
          Math.cos(
            Math.PI *
              noise.noise3D(
                x + pixelSize / 2,
                y + pixelSize / 2,
                this.iteration
              )
          )
        );
        ctx.fillStyle = tinycolor(color).toString();
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  };

  render() {
    return (
      <canvas
        width={16}
        height={16}
        aria-label="pretty pixels"
        style={{ margin: 16 }}
        onClick={this.draw}
        ref={(canvas) => {
          if (canvas) {
            this.ctx = canvas.getContext("2d");
          }
        }}
      />
    );
  }
}
