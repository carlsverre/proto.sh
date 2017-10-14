import React from "react";
import { Noise } from "noisejs";

const noise = new Noise(Math.random());

const TIME_DELTA = 0.004;
const PIXEL_WIDTH = 10;
const PIXEL_HEIGHT = 10;

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.time = Math.floor(Math.random() * 1000);
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize, false);
        this.onWindowResize();

        this.draw();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    onWindowResize = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    draw = () => {
        window.requestAnimationFrame(this.draw);

        this.time += TIME_DELTA;

        const { width, height } = this.state;
        const { ctx } = this;

        ctx.clearRect(0, 0, width, height);

        for (let x = 0; x < width; x += PIXEL_WIDTH) {
            for (let y = 0; y < height; y += PIXEL_HEIGHT) {
                let a = Math.min(0.5, noise.simplex3(x, y, this.time));
                let s = (noise.simplex2(x, y) + 1) / 2;
                let r = Math.floor(255 * s);
                let g = Math.floor(0 * s);
                let b = Math.floor(0 * s);

                ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
                ctx.fillRect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
            }
        }
    };

    render() {
        return (
            <canvas
                width={this.state.width}
                height={this.state.height}
                ref={canvas => {
                    if (canvas) {
                        this.ctx = canvas.getContext("2d");
                    }
                }}
            />
        );
    }
}
