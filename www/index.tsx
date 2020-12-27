import * as React from "react";
import * as ReactDOM from "react-dom";
import { Scene } from "../src/render";
import { Surface } from "../src/render/surface";
import { scenes, loadScene } from "../src/scene";
import { Size } from "../src/hook/useWindowSize";
import { useState, useEffect } from "react";
import clamp from "../src/util/clamp";

const parseQuery = (key: string): string | undefined => {
    let kv = window.location.search
        .substr(1)
        .split("&")
        .map(v => v.split("="))
        .find(([k, _]) => k === key);
    return kv ? kv[1] : undefined;
};

const getInitialScene = (): Scene => {
    return loadScene(parseQuery("s")) || scenes[0];
};

const getSurfaceSize = (): Size | undefined => {
    const rawWidth = parseQuery("w");
    const rawHeight = parseQuery("h");
    if (rawWidth && rawHeight) {
        const width = clamp(parseInt(rawWidth) || 0, 0, 10000);
        const height = clamp(parseInt(rawHeight) || 0, 0, 10000);
        return { width, height };
    }
    return;
};

const App = () => {
    const initialScene = getInitialScene();
    const [scene, setScene] = useState(initialScene);
    const sceneSize = getSurfaceSize();

    useEffect(() => {
        let i = 0;
        const handler = (evt: MouseEvent) => {
            if (evt.button !== 0) {
                return;
            }

            evt.preventDefault();

            let nextScene = scenes[0];
            while (true) {
                nextScene = scenes[++i % scenes.length];
                if (!nextScene.expensive) {
                    break;
                }
            }
            setScene(nextScene);
        };

        document.addEventListener("mouseup", handler);
        return () => document.removeEventListener("mouseup", handler);
    }, []);

    return <Surface scene={scene} size={sceneSize} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
